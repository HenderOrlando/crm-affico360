import { isMongoId } from 'class-validator';
import { BuildersService } from '@builder/builders';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { PspAccountServiceMongooseService } from '@psp-account/psp-account';
import { PspAccountCreateDto } from '@psp-account/psp-account/dto/psp-account.create.dto';
import { PspAccountUpdateDto } from '@psp-account/psp-account/dto/psp-account.update.dto';
import { PspAccountHasActiveDto } from '@psp-account/psp-account/dto/psp.has.active.dto';
import { PspAccountDocument } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import CheckStatsType from '@stats/stats/enum/check.stats.type';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
import EventsNamesPspEnum from './enum/events.names.psp.enum';

@Injectable()
export class PspAccountServiceService {
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(PspAccountServiceMongooseService)
    private lib: PspAccountServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newPspAccount(psp: PspAccountCreateDto) {
    return this.lib.create(psp);
  }

  async newManyPspAccount(createAccountPspsDto: PspAccountCreateDto[]) {
    return this.lib.createMany(createAccountPspsDto);
  }

  async updatePspAccount(psp: PspAccountUpdateDto) {
    return this.lib.update(psp.id, psp);
  }

  async hasActiveOnePsp(pspAccount: PspAccountHasActiveDto) {
    let statusName = 'Inactive';
    if (pspAccount.hasActive) {
      statusName = 'Active';
    }
    const status: StatusDocument =
      await this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        statusName,
      );
    return this.lib.update(pspAccount.id, {
      id: pspAccount.id,
      status: status._id,
    });
  }

  async updateManyPsps(psps: PspAccountUpdateDto[]) {
    return this.lib.updateMany(
      psps.map((psp) => psp.id.toString()),
      psps,
    );
  }

  async deletePspAccount(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyPspsAccount(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async getPspManual() {
    const pspManual = await this.builder.getPromisePspEventClient(
      EventsNamesPspEnum.findOneByName,
      'Manual',
    );
    const pspAccountManual = await this.lib.findAll({
      where: {
        psp: pspManual._id,
      },
    });
    if (!!pspAccountManual?.totalElements) {
      return pspAccountManual.list[0];
    }
    return this.lib.create({
      name: 'Manual 1',
      description: 'Psp Account Manual 1',
      psp: pspManual._id,
      apiKey: undefined,
      publicKey: undefined,
      privateKey: undefined,
      token: undefined,
      urlApi: undefined,
      urlSandbox: undefined,
      urlDashboard: undefined,
      accountId: undefined,
      username: undefined,
      password: undefined,
      category: undefined,
      status: undefined,
      bank: undefined,
      creator: undefined,
      blackListCountries: [],
      blackListBrands: [],
      whiteListCountries: [],
      whiteListBrands: [],
      idCashier: '',
    });
  }

  async countPspsAccount(query?: QuerySearchAnyDto) {
    return this.lib.count(query);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
  async checkStats(configCheckStats: ConfigCheckStatsDto) {
    switch (configCheckStats.checkType) {
      case CheckStatsType.ALL:
        this.checkStatsPspAccount(configCheckStats);
        break;
      case CheckStatsType.LEAD:
        throw new NotImplementedException();
      case CheckStatsType.PSP_ACCOUNT:
        this.checkStatsPspAccount(configCheckStats);
        break;
    }
  }

  async checkStatsPspAccount(configCheckStats: ConfigCheckStatsDto, page = 1) {
    throw new NotImplementedException();
    /* if (isMongoId(configCheckStats.pspAccountId)) {
      this.builder.emitTransferEventClient(
        EventsNamesTransferEnum.checkTransfersForPspAccountStats,
        configCheckStats.pspAccountId,
      );
    } else {
      const pspAccounts: ResponsePaginator<PspAccountDocument> =
        await this.lib.findAll({
          page,
        });
      for (const pspAccount of pspAccounts.list) {
        this.builder.emitTransferEventClient(
          EventsNamesTransferEnum.checkTransfersForPspAccountStats,
          pspAccount.id,
        );
      }
      if (pspAccounts.currentPage !== pspAccounts.lastPage) {
        this.checkStatsPspAccount(configCheckStats, pspAccounts.nextPage);
      }
    } */
  }

  async checkStatsForOnePspAccount(pspAccountId: string) {
    Logger.debug(pspAccountId, PspAccountServiceService.name);
    this.checkStats({
      pspAccountId,
      checkType: CheckStatsType.PSP_ACCOUNT,
    });
    return {
      data: 'Check stats started',
    };
  }

  async checkStatsForAllPspAccount() {
    //Logger.debug('Start', 'Check all pspAccount');
    let pagePspAccount = await this.lib.findAll();
    while (pagePspAccount?.nextPage != 1) {
      for (let h = 0; h < pagePspAccount.elementsPerPage; h++) {
        //Logger.debug(pagePspAccount.list[h].name, 'Checking pspAccount');
        this.checkStats({
          pspAccountId: pagePspAccount.list[h]?._id,
          checkType: CheckStatsType.PSP_ACCOUNT,
        });
      }
      pagePspAccount = await this.lib.findAll({
        page: pagePspAccount.nextPage,
      });
    }
    return {
      data: 'Check stats started',
    };
  }
}
