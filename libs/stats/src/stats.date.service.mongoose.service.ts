import { CommonService } from '@common/common';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Inject, Injectable } from '@nestjs/common';
import { isArray, isMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ClientSession, Connection, Model } from 'mongoose';
import { StatsDateAllCreateDto } from './dto/stats.date.all.create.dto';
import { StatsDateAllUpdateDto } from './dto/stats.date.all.update.dto';
import { StatsDateDocument } from './entities/mongoose/stats.date.schema';

@Injectable()
export class StatsDateServiceMongooseService extends BasicServiceModel<
  StatsDateDocument,
  Model<StatsDateDocument>,
  StatsDateAllCreateDto,
  StatsDateAllUpdateDto
> {
  constructor(
    @Inject('STATS_DATE_MODEL_MONGOOSE')
    private statsDateModel: Model<StatsDateDocument>,
    @Inject('MONGOOSE_CONNECTION')
    private readonly connection: Connection,
  ) {
    super(statsDateModel);
  }

  async startSession(): Promise<ClientSession> {
    return this.connection.startSession();
  }

  async globalStats(query: QuerySearchAnyDto) {
    query = query ?? {};
    const aggregate = this.statsDateModel.aggregate();
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
            $in: query.where[key].map((item) => new ObjectId(item)),
          };
        } else if (isMongoId(query.where[key])) {
          query.where[key] = new ObjectId(query.where[key]);
        } else if (query.where[key]['start'] || query.where[key]['end']) {
          query.where[key] = CommonService.checkDateAttr(query.where[key]);
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

  async groupByAffiliate(query: QuerySearchAnyDto) {
    return this.groupByExec(query, {
      affiliate: '$affiliate',
      brand: '$brand',
      department: '$department',
    });
  }
  async groupByPspAccount(query: QuerySearchAnyDto) {
    return this.groupByExec(query, {
      pspAccount: '$pspAccount',
      department: '$department',
    });
  }

  async groupByExec(query: QuerySearchAnyDto, _id: any) {
    query.take = query.take ?? 10;

    const aggregate = this.statsDateModel.aggregate();
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
        }
      }
      aggregate.match(query.where);
    }
    aggregate.group(this.getGroupBy(_id));
    const list = await aggregate.exec();
    const rta = list
      .map((item) => {
        return {
          ...item,
          affiliate: item._id['affiliate'],
          brand: item._id['brand'],
          department: item._id['department'],
          dateCheck: item.dateCheck[0],
        };
      })
      // TODO[hender - 2024/02/21] Fail sort stats
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
        await this.statsDateModel.populate(rta, {
          path: rel,
        });
      }
    }
    // TODO[hender - 2024/02/24] Remove when added integration group
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
      leads: {
        $accumulator: {
          init: function () {
            return [];
          },
          accumulate: function (state, leads: string[]) {
            return state.concat(leads);
          },
          accumulateArgs: ['$leads'],
          merge: function (state1, state2) {
            return state1.concat(state2);
          },
          finalize: function (state) {
            return state;
          },
          lang: 'js',
        },
      },
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
      // Cftd
      quantityCftd: { $sum: '$quantityCftd' },
      totalCftd: { $sum: '$totalCftd' },
      minTotalCftd: { $min: '$minTotalCftd' },
      maxTotalCftd: { $max: '$maxTotalCftd' },
      averageTotalCftd: { $avg: '$totalCftd' },
      // Ftd
      quantityFtd: { $sum: '$quantityFtd' },
      totalFtd: { $sum: '$totalFtd' },
      minTotalFtd: { $min: '$minTotalFtd' },
      maxTotalFtd: { $max: '$maxTotalFtd' },
      averageTotalFtd: { $avg: '$totalFtd' },
      // Retention
      quantityRetention: { $sum: '$quantityRetention' },
      totalRetention: { $sum: '$totalRetention' },
      minTotalRetention: { $min: '$minTotalRetention' },
      maxTotalRetention: { $max: '$maxTotalRetention' },
      averageTotalRetention: { $avg: '$totalRetention' },
      // Transfer
      quantityTransfer: { $sum: '$quantityTransfer' },
      totalTransfer: { $sum: '$totalTransfer' },
      minTotalTransfer: { $min: '$minTotalTransfer' },
      maxTotalTransfer: { $max: '$maxTotalTransfer' },
      averageTotalTransfer: { $avg: '$totalTransfer' },
      quantityApprovedTransfer: { $sum: '$quantityApprovedTransfer' },
      totalApprovedTransfer: { $sum: '$totalApprovedTransfer' },
      minTotalApprovedTransfer: { $min: '$minTotalApprovedTransfer' },
      maxTotalApprovedTransfer: { $max: '$maxTotalApprovedTransfer' },
      averageTotalApprovedTransfer: { $avg: '$totalApprovedTransfer' },
      // Deposit
      quantityDeposit: { $sum: '$quantityDeposit' },
      totalDeposit: { $sum: '$totalDeposit' },
      minTotalDeposit: { $min: '$minTotalDeposit' },
      maxTotalDeposit: { $max: '$maxTotalDeposit' },
      averageTotalDeposit: { $avg: '$totalDeposit' },
      quantityApprovedDeposit: { $sum: '$quantityApprovedDeposit' },
      totalApprovedDeposit: { $sum: '$totalApprovedDeposit' },
      minTotalApprovedDeposit: { $min: '$minTotalApprovedDeposit' },
      maxTotalApprovedDeposit: { $max: '$maxTotalApprovedDeposit' },
      averageTotalApprovedDeposit: { $avg: '$totalApprovedDeposit' },
      // Credit
      quantityCredit: { $sum: '$quantityCredit' },
      totalCredit: { $sum: '$totalCredit' },
      minTotalCredit: { $min: '$minTotalCredit' },
      maxTotalCredit: { $max: '$maxTotalCredit' },
      averageTotalCredit: { $avg: '$totalCredit' },
      quantityApprovedCredit: { $sum: '$quantityApprovedCredit' },
      totalApprovedCredit: { $sum: '$totalApprovedCredit' },
      minTotalApprovedCredit: { $min: '$minTotalApprovedCredit' },
      maxTotalApprovedCredit: { $max: '$maxTotalApprovedCredit' },
      averageTotalApprovedCredit: { $avg: '$totalApprovedCredit' },
      // Withdrawal
      quantityWithdrawal: { $sum: '$quantityWithdrawal' },
      totalWithdrawal: { $sum: '$totalWithdrawal' },
      minTotalWithdrawal: { $min: '$minTotalWithdrawal' },
      maxTotalWithdrawal: { $max: '$maxTotalWithdrawal' },
      averageTotalWithdrawal: { $avg: '$totalWithdrawal' },
      quantityApprovedWithdrawal: { $sum: '$quantityApprovedWithdrawal' },
      totalApprovedWithdrawal: { $sum: '$totalApprovedWithdrawal' },
      minTotalApprovedWithdrawal: { $min: '$minTotalApprovedWithdrawal' },
      maxTotalApprovedWithdrawal: { $max: '$maxTotalApprovedWithdrawal' },
      averageTotalApprovedWithdrawal: { $avg: '$totalApprovedWithdrawal' },

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
      // Conversion FTD
      conversionFtd: {
        $accumulator: {
          init: function () {
            return {
              quantityFtd: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (state, quantityFtd, quantityLeads) {
            return {
              quantityFtd: state.quantityFtd + quantityFtd,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: ['$quantityFtd', '$quantityLeads'],
          merge: function (state1, state2) {
            return {
              quantityFtd: state1.quantityFtd + state2.quantityFtd,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return state.quantityFtd / state.quantityLeads;
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
      // Conversion CFTD + Ftd
      conversion: {
        $accumulator: {
          init: function () {
            return {
              quantityCftd: 0,
              quantityFtd: 0,
              quantityLeads: 0,
            };
          },
          accumulate: function (
            state,
            quantityCftd,
            quantityFtd,
            quantityLeads,
          ) {
            return {
              quantityCftd: state.quantityCftd + quantityCftd,
              quantityFtd: state.quantityFtd + quantityFtd,
              quantityLeads: state.quantityLeads + quantityLeads,
            };
          },
          accumulateArgs: ['$quantityCftd', '$quantityFtd', '$quantityLeads'],
          merge: function (state1, state2) {
            return {
              quantityCftd: state1.quantityCftd + state2.quantityCftd,
              quantityFtd: state1.quantityFtd + state2.quantityFtd,
              quantityLeads: state1.quantityLeads + state2.quantityLeads,
            };
          },
          finalize: function (state) {
            return (
              (state.quantityCftd + state.quantityFtd) / state.quantityLeads
            );
          },
          lang: 'js',
        },
      },
      //data: { $push: '$$ROOT' },
    };
  }
}
