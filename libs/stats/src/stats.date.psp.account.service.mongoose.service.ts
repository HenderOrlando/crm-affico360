import { CommonService } from '@common/common';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Inject, Injectable } from '@nestjs/common';
import { StatsDateCreateDto } from '@stats/stats/dto/stats.date.create.dto';
import { StatsDateUpdateDto } from '@stats/stats/dto/stats.date.update.dto';
import { StatsDatePspAccountDocument } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { isArray, isDateString, isMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { isObjectIdOrHexString, Model } from 'mongoose';

@Injectable()
export class StatsDatePspAccountServiceMongooseService extends BasicServiceModel<
  StatsDatePspAccountDocument,
  Model<StatsDatePspAccountDocument>,
  StatsDateCreateDto,
  StatsDateUpdateDto
> {
  constructor(
    @Inject('STATS_DATE_PSP_ACCOUNT_MODEL_MONGOOSE')
    private statsDatePspAccountModel: Model<StatsDatePspAccountDocument>,
  ) {
    super(statsDatePspAccountModel);
  }

  async globalStats(query: QuerySearchAnyDto) {
    query = query ?? {};
    const aggregate = this.statsDatePspAccountModel.aggregate();
    if (query.where) {
      for (const key in query.where) {
        if (isArray(query.where[key])) {
          if (key === '$or') {
            for (const attrOR in query.where[key]) {
              for (const attr in query.where[key][attrOR]) {
                query.where[key][attrOR][attr] = CommonService.checkDateAttr(
                  query.where[key][attrOR][attr],
                );
              }
            }
            continue;
          }
          query.where[key] = {
            $in: query.where[key].map((item) => {
              if (!isObjectIdOrHexString(item)) {
                return item;
              }
              return new ObjectId(item);
            }),
          };
        } else if (isMongoId(query.where[key])) {
          query.where[key] = new ObjectId(query.where[key]);
        } else if (query.where[key]['start'] || query.where[key]['end']) {
          query.where[key] = CommonService.checkDateAttr(query.where[key]);
        } else if (isArray(query.where[key]['$in'])) {
          for (const id in query.where[key]['$in']) {
            if (isMongoId(query.where[key]['$in'][id])) {
              query.where[key]['$in'][id] = new ObjectId(
                query.where[key]['$in'][id],
              );
            }
          }
        }
      }
      aggregate.match(query.where);
    }
    if (query.order) {
      const sort = {};
      for (const order of query.order) {
        sort[order[0]] = order[1];
      }
      aggregate.sort(sort);
    }
    aggregate.group(this.getGroupBy());
    const list = await aggregate.exec();
    return list;
  }

  async groupByPspAccount(query: QuerySearchAnyDto) {
    query.take = query.take ?? 10;

    const aggregate = this.statsDatePspAccountModel.aggregate();
    if (query.where) {
      for (const key in query.where) {
        if (isArray(query.where[key])) {
          if (key === '$or') {
            for (const attrOR in query.where[key]) {
              for (const attr in query.where[key][attrOR]) {
                query.where[key][attrOR][attr] = CommonService.checkDateAttr(
                  query.where[key][attrOR][attr],
                );
              }
            }
            continue;
          }
          query.where[key] = {
            $in: query.where[key].map((item) =>
              isMongoId(item) ? new ObjectId(item) : item,
            ),
          };
        } else if (isMongoId(query.where[key])) {
          query.where[key] = new ObjectId(query.where[key]);
        } else if (query.where[key]['start'] || query.where[key]['end']) {
          query.where[key] = CommonService.checkDateAttr(query.where[key]);
        } else if (isArray(query.where[key]['$in'])) {
          for (const id in query.where[key]['$in']) {
            if (isMongoId(query.where[key]['$in'][id])) {
              query.where[key]['$in'][id] = new ObjectId(
                query.where[key]['$in'][id],
              );
            }
          }
        }
      }
      aggregate.match(query.where);
    }
    aggregate.group(
      this.getGroupBy({
        pspAccount: '$pspAccount',
        department: '$department',
      }),
    );
    const list = await aggregate.exec();
    const rta = list
      .map((item) => {
        return {
          ...item,
          pspAccount: item._id['pspAccount'],
          department: item._id['department'],
          dateCheck: item.dateCheck[0],
        };
      })
      .sort((a, b) =>
        new Date(a.dateCheck).getTime() > new Date(b.dateCheck).getTime()
          ? 1
          : -1,
      );
    if (
      !query?.relations ||
      query.relations.indexOf('affiliate') < 0 ||
      query.relations.indexOf('brand') < 0
    ) {
      query = query || {};
      query.relations = query.relations || [];
      if (query.relations.indexOf('affiliate') < 0) {
        query.relations.push('affiliate');
      }
      if (query.relations.indexOf('brand') < 0) {
        query.relations.push('brand');
      }
    }
    if (isArray(query.relations)) {
      for (const rel of query.relations) {
        this.statsDatePspAccountModel.populate(list, {
          path: rel,
        });
      }
    }
    return rta.map((statAff) => {
      if (statAff.brand?.name && statAff.name.indexOf(statAff.brand.name) < 0) {
        statAff.affiliate.name =
          statAff.affiliate?.name + ' - ' + statAff.brand?.name;
      }
      if (
        statAff.affiliate?.name &&
        statAff.affiliate?.name.indexOf('internal') < 0
      ) {
        let prefix = 'ANG';
        if (statAff.brand?.slug === 'fintavest') {
          prefix = 'STELLA';
        }
        if (statAff.affiliate?.name.indexOf(prefix) < 0) {
          statAff.affiliate.name = statAff.affiliate.name + ` ${prefix}`;
        }
      }
      return statAff;
    });
  }

  getGroupBy(_id = null) {
    return {
      _id,
      dateCheck: { $addToSet: '$dateCheck' },
      transfers: {
        $accumulator: {
          init: function () {
            return [];
          },
          accumulate: function (state, transfers: string[]) {
            return state.concat(transfers);
          },
          accumulateArgs: ['$transfers'],
          merge: function (state1, state2) {
            return state1.concat(state2);
          },
          finalize: function (state) {
            return state;
          },
          lang: 'js',
        },
      },
      // Leads
      quantityLeads: { $sum: '$quantityLeads' },
      totalLeads: { $sum: '$totalLeads' },
      minTotalLeads: { $min: '$minTotalLeads' },
      maxTotalLeads: { $max: '$maxTotalLeads' },
      averageTotalLeads: { $avg: '$totalLeads' },
      //averageTotalLeads: { $avg: '$averageTotalLeads' },
      // CFTD
      quantityCftd: { $sum: '$quantityCftd' },
      totalCftd: { $sum: '$totalCftd' },
      minTotalCftd: { $min: '$minTotalCftd' },
      maxTotalCftd: { $max: '$maxTotalCftd' },
      averageTotalCftd: { $avg: '$totalCftd' },
      //averageTotalCftd: { $avg: '$averageTotalCftd' },
      // FTD
      quantityFtd: { $sum: '$quantityFtd' },
      totalFtd: { $sum: '$totalFtd' },
      minTotalFtd: { $min: '$minTotalFtd' },
      maxTotalFtd: { $max: '$maxTotalFtd' },
      averageTotalFtd: { $avg: '$totalFtd' },
      //averageTotalFtd: { $avg: '$averageTotalFtd' },
      // Transfer
      quantityTransfer: { $sum: '$quantityTransfer' },
      totalTransfer: { $sum: '$totalTransfer' },
      minTotalTransfer: { $min: '$minTotalTransfer' },
      maxTotalTransfer: { $max: '$maxTotalTransfer' },
      averageTotalTransfer: { $avg: '$totalTransfer' },
      // Approved Lead
      quantityApprovedLead: { $sum: '$quantityApprovedLead' },
      totalApprovedLead: { $sum: '$totalApprovedLead' },
      minTotalApprovedLead: { $min: '$minTotalApprovedLead' },
      maxTotalApprovedLead: { $max: '$maxTotalApprovedLead' },
      averageTotalApprovedLead: { $avg: '$totalApprovedLead' },
      // Retention
      quantityRetention: { $sum: '$quantityRetention' },
      totalRetention: { $sum: '$totalRetention' },
      minTotalRetention: { $min: '$minTotalRetention' },
      maxTotalRetention: { $max: '$maxTotalRetention' },
      averageTotalRetention: { $avg: '$totalRetention' },
      // Chargeback
      quantityChargeback: { $sum: '$quantityChargeback' },
      totalChargeback: { $sum: '$totalChargeback' },
      minTotalChargeback: { $min: '$minTotalChargeback' },
      maxTotalChargeback: { $max: '$maxTotalChargeback' },
      averageTotalChargeback: { $avg: '$totalChargeback' },
      // Whitdrawal
      quantityWithdrawal: { $sum: '$quantityWithdrawal' },
      totalWithdrawal: { $sum: '$totalWithdrawal' },
      minTotalWithdrawal: { $min: '$minTotalWithdrawal' },
      maxTotalWithdrawal: { $max: '$maxTotalWithdrawal' },
      averageTotalWithdrawal: { $avg: '$totalWithdrawal' },
      //averageTotalApprovedLead: { $avg: '$averageTotalApprovedLead' },
      // Conversion Cftd
      conversionCftd: {
        $accumulator: {
          init: function () {
            return {
              quantityCftd: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (state, quantityCftd, quantityLeads) {
            return {
              quantityCftd: state.quantityCftd + quantityCftd,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: ['$quantityCftd', '$quantityLeads'],
          merge: function (state1, state2) {
            return {
              quantityCftd: state1.quantityCftd + state2.quantityCftd,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return state.quantityCftd / state.quantityLeads;
          },
          lang: 'js',
        },
      },
      // Conversion Approved Lead (FTD)
      conversionApprovedLead: {
        $accumulator: {
          init: function () {
            return {
              quantityApprovedLead: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (state, quantityApprovedLead, quantityLeads) {
            return {
              quantityApprovedLead:
                state.quantityApprovedLead + quantityApprovedLead,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: ['$quantityApprovedLead', '$quantityLeads'],
          merge: function (state1, state2) {
            return {
              quantityApprovedLead:
                state1.quantityApprovedLead + state2.quantityApprovedLead,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return state.quantityApprovedLead / state.quantityLeads;
          },
          lang: 'js',
        },
      },
      // Conversion Retention
      conversionRetention: {
        $accumulator: {
          init: function () {
            return {
              quantityRetention: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (state, quantityRetention, quantityLeads) {
            return {
              quantityRetention: state.quantityRetention + quantityRetention,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: ['$quantityRetention', '$quantityLeads'],
          merge: function (state1, state2) {
            return {
              quantityRetention:
                state1.quantityRetention + state2.quantityRetention,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return state.quantityRetention / state.quantityLeads;
          },
          lang: 'js',
        },
      },
      // Conversion Sales
      conversionSales: {
        $accumulator: {
          init: function () {
            return {
              quantitySales: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (state, quantitySales, quantityLeads) {
            return {
              quantityRetention: state.quantitySales + quantitySales,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: ['$quantitySales', '$quantityLeads'],
          merge: function (state1, state2) {
            return {
              quantityRetention: state1.quantitySales + state2.quantitySales,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return state.quantitySales / state.quantityLeads;
          },
          lang: 'js',
        },
      },
      // Conversion CFTD + Ftd
      conversion: {
        $accumulator: {
          init: function () {
            return {
              quantityCftd: 0,
              quantityApprovedLead: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (
            state,
            quantityCftd,
            quantityApprovedLead,
            quantityLeads,
          ) {
            return {
              quantityCftd: state.quantityCftd + quantityCftd,
              quantityApprovedLead:
                state.quantityApprovedLead + quantityApprovedLead,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: [
            '$quantityCftd',
            '$quantityApprovedLead',
            '$quantityLeads',
          ],
          merge: function (state1, state2) {
            return {
              quantityCftd: state1.quantityCftd + state2.quantityCftd,
              quantityApprovedLead:
                state1.quantityApprovedLead + state2.quantityApprovedLead,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return (
              (state.quantityCftd + state.quantityApprovedLead) /
              state.quantityLeads
            );
          },
          lang: 'js',
        },
      },
      //data: { $push: '$$ROOT' },
    };
  }
}
