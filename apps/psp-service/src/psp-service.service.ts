import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PspServiceMongooseService } from '@psp/psp';
import { PspCreateDto } from '@psp/psp/dto/psp.create.dto';
import { PspHasActiveDto } from '@psp/psp/dto/psp.has.active.dto';
import { PspUpdateDto } from '@psp/psp/dto/psp.update.dto';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import CheckStatsType from '@stats/stats/enum/check.stats.type';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
import axios from 'axios';
import { isArray } from 'class-validator';
import EventsNamesStatusEnum from '../../status-service/src/enum/events.names.status.enum';
import EventsNamesPspAccountEnum from './enum/events.names.psp.acount.enum';

@Injectable()
export class PspServiceService {
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(PspServiceMongooseService)
    private readonly lib: PspServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newPsp(psp: PspCreateDto) {
    return this.lib.create(psp);
  }

  async newManyPsp(createPspsDto: PspCreateDto[]) {
    return this.lib.createMany(createPspsDto);
  }

  async updatePsp(psp: PspUpdateDto) {
    return this.lib.update(psp.id.toString(), psp);
  }

  async hasActiveOnePsp(psp: PspHasActiveDto) {
    let statusName = 'Inactive';
    if (psp.hasActive) {
      statusName = 'Active';
    }
    const status: StatusDocument =
      await this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        statusName,
      );
    return this.lib.update(psp.id.toString(), {
      id: psp.id,
      status: status.id,
    });
  }

  async updateManyPsps(psps: PspUpdateDto[]) {
    return this.lib.updateMany(
      psps.map((psp) => psp.id.toString()),
      psps,
    );
  }

  async deletePsp(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyPsps(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async getPspManual() {
    const pspManual = await this.lib.findAll({
      where: {
        name: 'Manual',
      },
    });
    if (!!pspManual?.list[0]) {
      return pspManual.list[0];
    }
    return this.lib.create({
      name: 'Manual',
      description: 'PSP Manual',
      status: undefined,
      groups: [],
    });
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async checkStats(configCheckStats: ConfigCheckStatsDto) {
    switch (configCheckStats.checkType) {
      case CheckStatsType.ALL:
        this.checkStatsLead(configCheckStats);
        this.checkStatsTransfer(configCheckStats);
        break;
      case CheckStatsType.LEAD:
        this.checkStatsLead(configCheckStats);
        break;
      case CheckStatsType.PSP_ACCOUNT:
        this.checkStatsTransfer(configCheckStats);
        break;
    }
  }

  async checkStatsLead(configCheckStats: ConfigCheckStatsDto, page = 1) {
    const psps: ResponsePaginator<PspDocument> = await this.lib.findAll({
      page,
    });
    for (const psp of psps.list) {
      this.builder.emitTransferEventClient(
        EventsNamesTransferEnum.checkTransfersForPspStats,
        psp.id,
      );
    }
    if (psps.currentPage !== psps.lastPage) {
      this.checkStatsLead(configCheckStats, psps.nextPage);
    }
  }

  async checkStatsTransfer(configCheckStats: ConfigCheckStatsDto) {
    Logger.log('CHECK STATS PSPs TRANSFER', PspServiceService.name);
  }

  async checkCashierPsps() {
    try {
      const url = 'http://webservicesnt.org:5050/get/all-psps-available';
      const brandResponse = await axios.get(url);
      const pspList = brandResponse.data?.payload;
      let activeStatus: StatusDocument = null;
      if (isArray(pspList)) {
        for (const psp of pspList) {
          const slug = CommonService.getSlug(psp.name);
          const item = (
            await this.lib.findAll({
              where: {
                slug: slug,
              },
            })
          ).list[0];
          if (item?.id) {
            const pspDoc = await this.lib.update(item.id, {
              id: item.id,
              name: psp.name,
              idCashier: psp.id,
              slug: slug,
              description: `Psp "${psp.name}" active in cashier`,
            });
            const pspAccountName = pspDoc.name + ' Account';
            const pspAccount =
              await this.builder.getPromisePspAccountEventClient(
                EventsNamesPspAccountEnum.findOneByName,
                pspAccountName,
              );
            if (pspAccount?._id) {
              await this.builder.getPromisePspAccountEventClient(
                EventsNamesPspAccountEnum.updateOne,
                {
                  id: pspAccount._id,
                  name: pspAccountName,
                  idCashier: pspDoc.idCashier,
                  description: pspDoc.description,
                  psp: pspDoc._id,
                },
              );
            } else {
              activeStatus =
                activeStatus ??
                (await this.builder.getPromiseStatusEventClient(
                  EventsNamesStatusEnum.findOneByName,
                  'Active',
                ));
              await this.builder.getPromisePspAccountEventClient(
                EventsNamesPspAccountEnum.createOne,
                {
                  name: pspAccountName,
                  idCashier: pspDoc.idCashier,
                  description: pspDoc.description,
                  psp: pspDoc._id,
                  status: activeStatus._id,
                },
              );
            }
          } else {
            const pspDoc = await this.lib.create({
              name: psp.name,
              idCashier: psp.id,
              slug: slug,
              description: `Psp "${psp.name}" active in cashier`,
            });
            activeStatus =
              activeStatus ??
              (await this.builder.getPromiseStatusEventClient(
                EventsNamesStatusEnum.findOneByName,
                'Active',
              ));
            await this.builder.getPromisePspAccountEventClient(
              EventsNamesPspAccountEnum.createOne,
              {
                name: pspDoc.name + 'Account',
                idCashier: psp.id,
                description: pspDoc.description,
                psp: pspDoc._id,
                status: activeStatus._id,
              },
            );
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
