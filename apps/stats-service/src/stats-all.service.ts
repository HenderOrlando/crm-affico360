import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { StatsDateAllCreateDto } from '@stats/stats/dto/stats.date.all.create.dto';
import { StatsDateAllUpdateDto } from '@stats/stats/dto/stats.date.all.update.dto';
import { StatsDate } from '@stats/stats/entities/mongoose/stats.date.schema';
import { StatsDateServiceMongooseService } from '@stats/stats/stats.date.service.mongoose.service';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import { isDate, isNumber } from 'class-validator';
import { Lead } from './../../../libs/lead/src/entities/mongoose/lead.schema';
import { Transfer } from './../../../libs/transfer/src/entities/mongoose/transfer.schema';
import EventsNamesStatsEnum from './enum/events.names.stats.enum';
import StatsParamNameEnum from './enum/stats.param.names.enum';

@Injectable()
export class StatsAllService {
  private builder: BuildersService;
  private statusFtd: Promise<StatusDocument> = null;
  private statusCftd: Promise<StatusDocument> = null;
  private statusRetention: Promise<StatusDocument> = null;
  constructor(
    @Inject(BuildersService)
    builder: BuildersService,

    @Inject(StatsDateServiceMongooseService)
    private libStatsDate: StatsDateServiceMongooseService,
  ) {
    this.builder = builder;
  }

  async createStat(statCreate: StatsDateAllCreateDto) {
    return this.libStatsDate.create(statCreate);
  }

  async findStats(search: QuerySearchAnyDto) {
    return this.libStatsDate.findAll(search);
  }

  // ---------------------

  addNewLead(lead: Lead) {
    // createdAt + quantityLead
    return this.addStatsLeadUpdated(
      lead,
      lead.createdAt,
      StatsParamNameEnum.LEAD_LEADS,
    );
  }

  addNewCftd(lead: Lead) {
    // dateCftd + quantityCftd
    Logger.debug(lead, 'Create CFTD lead');
    return this.addStatsLeadUpdated(
      lead,
      lead.dateCFTD,
      StatsParamNameEnum.LEAD_CFTD,
    );
  }

  addNewFtd(lead: Lead) {
    // dateFtd + quantityFtd
    Logger.debug(lead, 'Create FTD lead');
    return this.addStatsLeadUpdated(
      lead,
      lead.dateFTD,
      StatsParamNameEnum.LEAD_FTD,
    );
  }

  addNewRetention(lead: Lead) {
    // dateRetention + quantityRetention
    Logger.debug(lead, 'Create Retention lead');
    return this.addStatsLeadUpdated(
      lead,
      lead.createdAt,
      StatsParamNameEnum.LEAD_RETENTION,
    );
  }

  addNewDeposit(deposit: Transfer) {
    // createdAt + quantity, min, max, total
    Logger.debug(deposit, 'Create Deposit');
    return this.addStatsTransferUpdated(
      deposit,
      deposit.createdAt,
      StatsParamNameEnum.TRANSFER_DEPOSIT,
    );
  }

  addApproveDeposit(deposit: Transfer) {
    // approvedAt + quantityDepositApproved, minDepositApproved, maxDepositApproved, totalDepositApproved
    Logger.debug(deposit, 'Approved Deposit');
    if (!deposit.approvedAt) {
      throw new BadRequestException('Deposit has no approved');
    }
    return this.addStatsTransferUpdated(
      deposit,
      deposit.approvedAt,
      StatsParamNameEnum.TRANSFER_DEPOSIT_APPROVED,
    );
  }

  addRejectDeposit(deposit: Transfer) {
    // rejectedAt + quantityDepositRejected, minDepositRejected, maxDepositRejected, totalDepositRejected
    Logger.debug(deposit, 'Reject Deposit');
    if (!deposit.rejectedAt) {
      throw new BadRequestException('Deposit has no rejected');
    }
    return this.addStatsTransferUpdated(
      deposit,
      deposit.rejectedAt,
      StatsParamNameEnum.TRANSFER_DEPOSIT_REJECTED,
    );
  }

  addNewCredit(credit: Transfer) {
    // createdAt + quantity, min, max, total
    Logger.debug(credit, 'Create Credit');
    return this.addStatsTransferUpdated(
      credit,
      credit.createdAt,
      StatsParamNameEnum.TRANSFER_CREDIT,
    );
  }

  addApproveCredit(credit: Transfer) {
    // approvedAt + quantityCreditApproved, minCreditApproved, maxCreditApproved, totalCreditApproved
    Logger.debug(credit, 'Approved Credit');
    if (!credit.approvedAt) {
      throw new BadRequestException('Credit has no approved');
    }
    return this.addStatsTransferUpdated(
      credit,
      credit.rejectedAt,
      StatsParamNameEnum.TRANSFER_CREDIT_APPROVED,
    );
  }

  addRejectCredit(credit: Transfer) {
    // rejectedAt + quantityCreditRejected, minCreditRejected, maxCreditRejected, totalCreditRejected
    Logger.debug(credit, 'Reject Credit');
    if (!credit.rejectedAt) {
      throw new BadRequestException('Credit has no rejected');
    }
    return this.addStatsTransferUpdated(
      credit,
      credit.rejectedAt,
      StatsParamNameEnum.TRANSFER_CREDIT_REJECTED,
    );
  }

  addNewWithdrawal(withdrawal: Transfer) {
    // createdAt + quantity, min, max, total
    Logger.debug(withdrawal, 'Create Withdrawal');
    return this.addStatsTransferUpdated(
      withdrawal,
      withdrawal.createdAt,
      StatsParamNameEnum.TRANSFER_WITHDRAWAL,
    );
  }

  addApprovedWithdrawal(withdrawal: Transfer) {
    // approvedAt + quantityWithdrawalApproved, minWithdrawalApproved, maxWithdrawalApproved, totalWithdrawalApproved
    Logger.debug(withdrawal, 'Approved Withdrawal');
    if (!withdrawal.approvedAt) {
      throw new BadRequestException('Withdrawal has no approved');
    }
    return this.addStatsTransferUpdated(
      withdrawal,
      withdrawal.approvedAt,
      StatsParamNameEnum.TRANSFER_WITHDRAWAL_APPROVED,
    );
  }

  addRejectWithdrawal(withdrawal: Transfer) {
    // rejectedAt + quantityWithdrawalRejected, minWithdrawalRejected, maxWithdrawalRejected, totalWithdrawalRejected
    Logger.debug(withdrawal, 'Reject Withdrawal');
    if (!withdrawal.rejectedAt) {
      throw new BadRequestException('Withdrawal has no rejected');
    }
    return this.addStatsTransferUpdated(
      withdrawal,
      withdrawal.rejectedAt,
      StatsParamNameEnum.TRANSFER_WITHDRAWAL_REJECTED,
    );
  }

  addNewChargeback(chargeback: Transfer) {
    // createdAt + quantity, min, max, total
    Logger.debug(chargeback, 'Create Chargeback');
    return this.addStatsTransferUpdated(
      chargeback,
      chargeback.createdAt,
      StatsParamNameEnum.TRANSFER_CHARGEBACK,
    );
  }

  addApprovedChargeback(chargeback: Transfer) {
    // approvedAt + quantityChargebackApproved, minChargebackApproved, maxChargebackApproved, totalChargebackApproved
    Logger.debug(chargeback, 'Approved Chargeback');
    if (!chargeback.approvedAt) {
      throw new BadRequestException('Chargeback has no approved');
    }
    return this.addStatsTransferUpdated(
      chargeback,
      chargeback.approvedAt,
      StatsParamNameEnum.TRANSFER_CHARGEBACK_APPROVED,
    );
  }

  addRejectChargeback(chargeback: Transfer) {
    // rejectedAt + quantityChargebackRejected, minChargebackApproved, maxChargebackApproved, totalChargebackApproved
    Logger.debug(chargeback, 'Rejected Chargeback');
    if (!chargeback.rejectedAt) {
      throw new BadRequestException('Chargeback has no rejected');
    }
    return this.addStatsTransferUpdated(
      chargeback,
      chargeback.rejectedAt,
      StatsParamNameEnum.TRANSFER_CHARGEBACK_REJECTED,
    );
  }

  async addStatsLeadUpdated(
    lead: Lead,
    dateCheck: Date,
    leadParam: StatsParamNameEnum,
    toAdd = true,
  ) {
    const stats: StatsDate = await this.getStatsLead(new Date(dateCheck), lead);
    let quantity = -1;
    if (toAdd) {
      quantity = 1;
    }
    stats[`quantity${leadParam}`] =
      (isNumber(stats[`quantity${leadParam}`])
        ? stats[`quantity${leadParam}`]
        : 0) + quantity;
    return this.libStatsDate.update(
      stats.id,
      stats as unknown as StatsDateAllUpdateDto,
    );
  }

  async addStatsTransferUpdated(
    transfer: Transfer,
    dateCheck: Date,
    transferParam: StatsParamNameEnum,
    toAdd = true,
  ) {
    const stats: StatsDate = await this.getStatsTransfer(
      new Date(dateCheck),
      transfer,
    );
    let quantity = -1;
    if (toAdd) {
      quantity = 1;
      if (stats[`min${transferParam}`] > transfer.amount) {
        stats[`min${transferParam}`] = transfer.amount;
      }
      if (stats[`max${transferParam}`] < transfer.amount) {
        stats[`max${transferParam}`] = transfer.amount;
      }
    } else {
      if (stats[`min${transferParam}`] === transfer.amount) {
        //TODO[hender-09/07/2024] Recalculate min value
      }
      if (stats[`max${transferParam}`] === transfer.amount) {
        //TODO[hender-09/07/2024] Recalculate max value
      }
    }
    const val = transfer.amount * quantity;
    stats[`quantity${transferParam}`] += quantity;
    stats[`total${transferParam}`] += val;
    return this.libStatsDate.update(
      stats.id,
      stats as unknown as StatsDateAllUpdateDto,
    );
  }

  private async getStatsLead(dateCheck: Date, lead: Lead): Promise<StatsDate> {
    if (!isDate(dateCheck)) {
      throw new BadRequestException(`Date format "${dateCheck}" is not valid`);
    }
    dateCheck.setMilliseconds(0);
    dateCheck.setSeconds(0);
    dateCheck.setMinutes(0);
    dateCheck.setHours(0);
    const statList: ResponsePaginator<StatsDate> =
      await this.libStatsDate.findAll({
        where: {
          dateCheck: dateCheck.toISOString(),
          psp: null,
          pspAccount: null,
          country: lead.country,
          department: lead.crmDepartment,
          brand: lead.brand,
          crm: lead.crm,
          affiliate: lead.affiliate,
          affiliateGroup: lead.group,
          integrationGroup: lead.group,
          sourceType: lead.referralType,
        },
      });
    let stat: StatsDate = null;
    if (!statList.totalElements) {
      const name = `${dateCheck.toISOString()} Stats`;
      stat = await this.libStatsDate.create({
        dateCheck,
        name,
        slug: CommonService.getSlug(name),
        description: '',
        period: PeriodEnum.DAILY,
        psp: null,
        pspAccount: null,
        country: lead.country,
        department: lead.crmDepartment,
        brand: lead.brand,
        crm: lead.crm,
        affiliate: lead.affiliate,
        affiliateGroup: lead.group,
        integrationGroup: lead.group,
        sourceType: lead.referralType,
        leads: [lead._id],
        transfers: [],
      } as unknown as StatsDateAllCreateDto);
    } else {
      stat = statList.list[0];
    }
    return stat;
  }

  private async getStatsTransfer(
    dateCheck: Date,
    transfer: Transfer,
  ): Promise<StatsDate> {
    const lead = transfer.lead;
    if (!isDate(dateCheck)) {
      throw new BadRequestException(`Date format "${dateCheck}" is not valid`);
    }
    dateCheck.setMilliseconds(0);
    dateCheck.setSeconds(0);
    dateCheck.setMinutes(0);
    dateCheck.setHours(0);
    const statList: ResponsePaginator<StatsDate> =
      await this.libStatsDate.findAll({
        where: {
          dateCheck: dateCheck.toISOString(),
          psp: transfer.psp,
          pspAccount: transfer.pspAccount,

          country: lead.country,
          department: lead.crmDepartment,
          brand: lead.brand,
          crm: lead.crm,
          affiliate: lead.affiliate,
          affiliateGroup: lead.group,
          integrationGroup: lead.group,
          sourceType: lead.referralType,
        },
      });
    let stat: StatsDate = null;
    if (!statList.totalElements) {
      const name = `${dateCheck.toISOString} Stats`;
      stat = await this.libStatsDate.create({
        dateCheck,
        psp: transfer.psp,
        pspAccount: transfer.pspAccount,
        name,
        slug: CommonService.getSlug(name),
        description: '',
        period: PeriodEnum.DAILY,
        country: lead.country,
        department: lead.crmDepartment,
        brand: lead.brand,
        crm: lead.crm,
        affiliate: lead.affiliate,
        affiliateGroup: lead.group,
        integrationGroup: lead.group,
        sourceType: lead.referralType,
        leads: [lead._id],
        transfers: [],
      } as unknown as StatsDateAllCreateDto);
    } else {
      stat = statList.list[0];
    }
    return stat;
  }

  private async getStatusFtd() {
    if (!this.statusFtd) {
      this.statusFtd = this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'ftd',
      );
    }
    return this.statusFtd;
  }

  private async getStatusCftd() {
    if (!this.statusCftd) {
      this.statusCftd = this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'cftd',
      );
    }
    return this.statusCftd;
  }

  private async getStatusRetention() {
    if (!this.statusRetention) {
      this.statusRetention = this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'retention',
      );
    }
    return this.statusRetention;
  }
}
