import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesPspEnum from 'apps/psp-service/src/enum/events.names.psp.enum';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
const time = '0 */20 * * * *';
@Injectable()
export class JobService {
  static periodicTime = {
    checkLeadCreated: CronExpression.EVERY_10_MINUTES,
    checkLeadStatus: CronExpression.EVERY_5_MINUTES,
    //checkLeadStatus: time,
    //checkAffiliateLeadsStats: time,
    /*
    checkBrandLeadsStats: time,
    checkCrmLeadsStats: time,
    checkPspAccountLeadsStats: time,
    checkPspLeadsStats: time, */
    checkAffiliateLeadsStats: CronExpression.EVERY_DAY_AT_MIDNIGHT,
    checkAffiliateStats: CronExpression.EVERY_HOUR,
    checkBrandLeadsStats: CronExpression.EVERY_DAY_AT_1AM,
    checkCrmLeadsStats: CronExpression.EVERY_DAY_AT_2AM,
    checkPspAccountLeadsStats: CronExpression.EVERY_DAY_AT_3AM,
    checkPspLeadsStats: CronExpression.EVERY_DAY_AT_4AM,

    checkLeadPayment: CronExpression.EVERY_5_SECONDS,
    checkAffiliatesStats: CronExpression.EVERY_5_SECONDS,
    checkCrmStats: CronExpression.EVERY_5_SECONDS,
    checkBusinessUnitStats: CronExpression.EVERY_5_SECONDS,
    checkPspStats: CronExpression.EVERY_5_SECONDS,
    checkPspAccountStats: CronExpression.EVERY_5_SECONDS,
    checkCashierStatus: CronExpression.EVERY_10_MINUTES,
    checkCashierBrands: CronExpression.EVERY_4_HOURS,
    checkCashierPsps: CronExpression.EVERY_4_HOURS,
    checkFilesDownloads: CronExpression.EVERY_30_MINUTES,
  };
  private env = 'DEV';

  constructor(
    readonly configService: ConfigService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(`${EventClientEnum.TRANSFER}-CLIENT`)
    private readonly transferClient: ClientProxy,
  ) {
    this.env = configService.get('ENVIRONMENT');
  }

  @Cron(JobService.periodicTime.checkFilesDownloads, {
    timeZone: process.env.TZ,
  })
  checkFilesDownloadsCron() {
    Logger.log('Checking Files created to downloads', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      this.builder.emitFileEventClient(EventsNamesFileEnum.checkDownload, {});
    }
  }

  @Cron(JobService.periodicTime.checkLeadCreated, {
    timeZone: process.env.TZ,
  })
  checkLeadCreatedInCrmCron() {
    Logger.log('Checking Lead created in CRM', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      /* this.leadClient.emit(EventsNamesLeadEnum.checkLeadsCreatedInCrm, {
        name: 'cronCheckLead',
      }); */
    }
  }

  @Cron(JobService.periodicTime.checkLeadStatus, {
    timeZone: process.env.TZ,
  })
  checkLeadStatusInCrmCron() {
    Logger.log('Checking Lead status in CRM', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      const affiliatesId = [
        '65369ab7993d84e37bd9445e', // Profitbitz
        '659ba2b0314b3139b59699b1', // Bearinvester
        '65369ab6993d84e37bd9444d', // FxIntegral
        '65369ab3993d84e37bd9441a', // FxTrategy
        '65369ab5993d84e37bd9443c', // Noimarkets
        '65118b540870a97fd2efc085', // AllMarkets
        '65a062067397489199364f42', // Macrocien
        '65a062057397489199364ee5', // Cryptrendy
        '65a062037397489199364e8c', // ErvShares
        '65a05ba673974891993616a5', // Fintavest
        '65c39e56c6cb8e22f9e2b5a0', // FibraFx
      ];
      for (let h = 0; h < affiliatesId.length; h++) {
        setTimeout(() => {
          this.builder.emitLeadEventClient(
            EventsNamesLeadEnum.checkLeadsStatusInCrm,
            [affiliatesId[h]],
          );
        }, 1000 * h);
      }
    }
  }

  @Cron(JobService.periodicTime.checkAffiliateLeadsStats, {
    timeZone: process.env.TZ,
  })
  checkAffiliateLeadsStatsCron() {
    Logger.log('Checking Affiliate leads stats', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      this.builder.emitAffiliateEventClient(
        EventsNamesAffiliateEnum.checkAffiliateLeadsStats,
        {},
      );
    }
  }

  @Cron(JobService.periodicTime.checkAffiliateStats, {
    timeZone: process.env.TZ,
  })
  checkAffiliateStatsCron() {
    Logger.log('Checking Affiliate leads stats', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      this.builder.emitAffiliateEventClient(
        EventsNamesAffiliateEnum.checkAffiliateStats,
        {},
      );
    }
  }

  @Cron(JobService.periodicTime.checkBrandLeadsStats, {
    timeZone: process.env.TZ,
  })
  checkBrandStatsCron() {
    Logger.log('Checking Brand leads stats', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      /* this.leadClient.emit(EventsNamesBusinessUnitEnum.checkBrandStats, {
        checkType: CheckStatsType.ALL,
      }); */
    }
  }

  @Cron(JobService.periodicTime.checkCrmLeadsStats, {
    timeZone: process.env.TZ,
  })
  checkCrmStatsCron() {
    Logger.log('Checking Crm leads stats', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      /* this.leadClient.emit(EventsNamesCrmEnum.checkCrmStats, {
        checkType: CheckStatsType.ALL,
      }); */
    }
  }

  @Cron(JobService.periodicTime.checkPspAccountLeadsStats, {
    timeZone: process.env.TZ,
  })
  checkPspAccountStatsCron() {
    Logger.log('Checking Psp Account leads stats', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      /* this.leadClient.emit(EventsNamesPspEnum.checkPspAccountStats, {
        checkType: CheckStatsType.ALL,
      }); */
    }
  }

  @Cron(JobService.periodicTime.checkPspLeadsStats, {
    timeZone: process.env.TZ,
  })
  checkPspStatsCron() {
    Logger.log('Checking Psp leads stats', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      /* this.leadClient.emit(EventsNamesPspEnum.checkPspStats, {
        checkType: CheckStatsType.ALL,
      }); */
    }
  }
  @Cron(JobService.periodicTime.checkCashierStatus, {
    timeZone: process.env.TZ,
  })
  checkCashierStatusCron() {
    Logger.log('Checking cashier status', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      this.builder.emitTransferEventClient(
        EventsNamesTransferEnum.checkTransferInCashierByStatus,
        '',
      );
    }
  }
  @Cron(JobService.periodicTime.checkCashierBrands, {
    timeZone: process.env.TZ,
  })
  checkCashierBrandsCron() {
    Logger.log('Checking cashier brands', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      this.builder.emitBusinessUnitEventClient(
        EventsNamesBusinessUnitEnum.checkCashierBrands,
        {},
      );
    }
  }
  @Cron(JobService.periodicTime.checkCashierPsps, {
    timeZone: process.env.TZ,
  })
  checkCashierPspsCron() {
    Logger.log('Checking cashier psps', JobService.name);
    if (this.env === EnvironmentEnum.prod) {
      this.builder.emitPspEventClient(EventsNamesPspEnum.checkCashierPsps, {});
    }
  }
}
