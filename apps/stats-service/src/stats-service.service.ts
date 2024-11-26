import { BuildersService } from '@builder/builders';
import { CategoryDocument } from '@category/category/entities/mongoose/category.schema';
import { CommonService } from '@common/common';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PspAccountDocument } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { StatsDateAllCreateDto } from '@stats/stats/dto/stats.date.all.create.dto';
import { StatsDateCreateDto } from '@stats/stats/dto/stats.date.create.dto';
import { StatsDateAffiliateDocument } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { StatsDatePspAccountDocument } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { StatsDateDocument } from '@stats/stats/entities/mongoose/stats.date.schema';
import { StatsDateAffiliateServiceMongooseService } from '@stats/stats/stats.date.affiliate.service.mongoose.service';
import { StatsDatePspAccountServiceMongooseService } from '@stats/stats/stats.date.psp.account.service.mongoose.service';
import { StatsDateServiceMongooseService } from '@stats/stats/stats.date.service.mongoose.service';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import {
  Transfer,
  TransferDocument,
} from '@transfer/transfer/entities/mongoose/transfer.schema';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesPspAccountEnum from 'apps/psp-service/src/enum/events.names.psp.acount.enum';
import EventsNamesPspEnum from 'apps/psp-service/src/enum/events.names.psp.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
import { isArray, isDateString, isEmpty } from 'class-validator';
import { ClientSession } from 'mongoose';
import { StatsDateMongoose } from './enum/stats.date.type';
import StatsParamNameEnum from './enum/stats.param.names.enum';
import StatusLeadEnum from './enum/status.lead.enum';
import StatusTransferEnum from './enum/status.transfer.enum';

@Injectable()
export class StatsServiceService {
  private builder: BuildersService;
  private statusFtd: StatusDocument;
  constructor(
    @Inject(BuildersService)
    builder: BuildersService,

    @Inject(StatsDateAffiliateServiceMongooseService)
    private libStatsDateAffiliate: StatsDateAffiliateServiceMongooseService,

    @Inject(StatsDateServiceMongooseService)
    private libStatsDate: StatsDateServiceMongooseService,

    @Inject(StatsDatePspAccountServiceMongooseService)
    private libStatsDatePspAccount: StatsDatePspAccountServiceMongooseService,
  ) {
    this.builder = builder;
  }

  async createStat(statCreate: StatsDateCreateDto) {
    return this.libStatsDateAffiliate.create(statCreate);
  }

  private async getStatusFtd(): Promise<StatusDocument> {
    if (!this.statusFtd) {
      this.statusFtd = await this.getStatusFtdDB();
    }
    return this.statusFtd;
  }

  async checkStatsDateAll(query: QuerySearchAnyDto) {
    query = query ?? {};
    query.take = 100;
    const dateCheck = query.where?.start ? new Date(query.where?.start) : null;
    const lastDateCheck = query.where?.end ? new Date(query.where.end) : null;
    if (dateCheck && lastDateCheck) {
      query.where = {
        createdAt: {
          start: CommonService.getDateFromOutside(
            dateCheck.toISOString(),
            true,
          ),
          end: CommonService.getDateFromOutside(
            lastDateCheck.toISOString(),
            false,
          ),
        },
      };
    }
    if (query.where?.start) {
      delete query.where.start;
    }
    if (query.where?.end) {
      delete query.where.end;
    }
    query.page = 1;
    do {
      const leadsPage = await this.builder.getPromiseLeadEventClient(
        EventsNamesLeadEnum.findAll,
        query,
      );
      let _i = 0;
      for (const lead of leadsPage.list) {
        await this.checkStatsByDateLead(
          lead,
          lead.createdAt,
          StatusLeadEnum.REG,
        );
        await this.checkStatsByDateLead(
          lead,
          lead.dateCFTD,
          StatusLeadEnum.CFTD,
        );
        await this.checkStatsByDateLead(lead, lead.dateFTD, StatusLeadEnum.FTD);
        await this.checkStatsByDateLead(
          lead,
          lead.dateRetention,
          StatusLeadEnum.RET,
        );
        Logger.debug(`${++_i} / ${leadsPage.totalElements}`, 'Progress lead');
      }
      Logger.debug(
        `${query.page} / ${leadsPage.lastPage}`,
        'Progress lead page',
      );
      query.page = leadsPage.nextPage;
    } while (query.page != 1);
    query.page = 1;
    query.relations = ['lead'];
    query.where = {
      approvedAt: {
        start: query.where.createdAt.start,
        end: query.where.createdAt.end,
      },
    };
    delete query.where.createdAt;
    do {
      const transferPage = await this.builder.getPromiseTransferEventClient(
        EventsNamesTransferEnum.findAll,
        query,
      );
      for (const transfer of transferPage.list) {
        await this.checkStatsByDateTransfer(
          transfer.lead,
          transfer as TransferDocument,
          transfer.approvedAt
            ? new Date(transfer.approvedAt).toISOString()
            : null,
          null,
          StatusTransferEnum.APVD,
          null,
        );
      }
    } while (query.page != 1);
    return {
      code: 200,
      data: 'success',
    };
  }

  private setStatsBase(
    documentStats: StatsDateDocument,
    transfer: Transfer,
    paramName: StatsParamNameEnum,
    sumQuantity = false,
  ) {
    if (sumQuantity) {
      documentStats[`quantity${paramName}`] =
        documentStats[`quantity${paramName}`] ?? 0;
      documentStats[`quantity${paramName}`]++;
    }
    documentStats[`total${paramName}`] =
      documentStats[`total${paramName}`] ?? 0;
    documentStats[`total${paramName}`] += transfer.amount;
    documentStats[`maxTotal${paramName}`] =
      documentStats[`maxTotal${paramName}`] < transfer.amount
        ? transfer.amount
        : documentStats[`maxTotal${paramName}`];
    documentStats[`minTotal${paramName}`] =
      documentStats[`minTotal${paramName}`] > transfer.amount
        ? transfer.amount
        : documentStats[`minTotal${paramName}`];
  }

  private async checkStatsByDateLead(
    lead: LeadDocument,
    dateString: string,
    statusCheck: StatusLeadEnum,
  ) {
    if (isDateString(dateString)) {
      const date = this.getDateResetToStartDay(dateString);
      //!Start transaction
      return this.libStatsDate.startSession().then((session) => {
        session.withTransaction(async () => {
          const documentStatsLead: StatsDateDocument =
            await this.getDocumentStatDates(lead, date);
          documentStatsLead.leads = documentStatsLead.leads ?? [];
          //if(documentStatsLead.leads.indexOf)
          documentStatsLead.leads.push(lead._id);
          switch (statusCheck) {
            case StatusLeadEnum.REG:
              documentStatsLead.quantityLeads =
                documentStatsLead.quantityLeads ?? 0;
              documentStatsLead.quantityLeads++;
              break;
            case StatusLeadEnum.CFTD:
              documentStatsLead.quantityCftd =
                documentStatsLead.quantityCftd ?? 0;
              documentStatsLead.quantityCftd++;
              break;
            case StatusLeadEnum.FTD:
              documentStatsLead.quantityFtd =
                documentStatsLead.quantityFtd ?? 0;
              documentStatsLead.quantityFtd++;
              break;
            case StatusLeadEnum.RET:
              documentStatsLead.quantityRetention =
                documentStatsLead.quantityRetention ?? 0;
              documentStatsLead.quantityRetention++;
              break;
          }
          return documentStatsLead.save({ session });
        });
      });
      //!End transaction
    }
    return Promise.resolve();
  }
  private async checkStatsByDateTransfer(
    lead: LeadDocument,
    transfer: TransferDocument,
    dateString: string,
    statusCheck: StatusLeadEnum,
    statusCheckTransfer: StatusTransferEnum,
    session?: ClientSession,
  ) {
    if (!session) {
      //!Start transaction
      return this.libStatsDate.startSession().then((_session) => {
        _session.withTransaction(async () => {
          return this.checkStatsByDateOneTransfer(
            lead,
            transfer,
            dateString,
            statusCheck,
            statusCheckTransfer,
            _session,
          );
        });
      });
      //!End transaction
    }
    return this.checkStatsByDateOneTransfer(
      lead,
      transfer,
      dateString,
      statusCheck,
      statusCheckTransfer,
      session,
    );
  }

  async checkStatsByDateOneTransfer(
    lead: LeadDocument,
    transfer: TransferDocument,
    dateString: string,
    statusCheck: StatusLeadEnum,
    statusCheckTransfer: StatusTransferEnum,
    session?: ClientSession,
  ) {
    if (isDateString(dateString)) {
      const date = this.getDateResetToStartDay(dateString);
      const documentStatsTransfer: StatsDateDocument =
        await this.getDocumentStatDates(lead, date);
      documentStatsTransfer.leads = documentStatsTransfer.leads ?? [];
      //if(documentStatsLead.leads.indexOf)
      documentStatsTransfer.leads.push(lead._id);
      documentStatsTransfer.transfers = documentStatsTransfer.transfers ?? [];
      documentStatsTransfer.transfers.push(transfer._id);
      switch (statusCheck) {
        case StatusLeadEnum.REG:
          this.setStatsBase(
            documentStatsTransfer,
            transfer,
            StatsParamNameEnum.LEAD_LEADS,
          );
          break;
        case StatusLeadEnum.CFTD:
          this.setStatsBase(
            documentStatsTransfer,
            transfer,
            StatsParamNameEnum.LEAD_CFTD,
          );
          break;
        case StatusLeadEnum.FTD:
          this.setStatsBase(
            documentStatsTransfer,
            transfer,
            StatsParamNameEnum.LEAD_FTD,
          );
          break;
        case StatusLeadEnum.RET:
          this.setStatsBase(
            documentStatsTransfer,
            transfer,
            StatsParamNameEnum.LEAD_RETENTION,
          );
          break;
      }
      // Transfers
      /* this.setStatsBase(
        documentStatsTransfer,
        transfer,
        StatsParamNameEnum.TRANSFER,
        true,
      ); */
      if (statusCheckTransfer === StatusTransferEnum.REG) {
        switch (transfer.operationType) {
          case OperationTransactionType.deposit:
            // Transfer Deposit
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_DEPOSIT,
              true,
            );
            break;
          case OperationTransactionType.credit:
            // Transfer Credit
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_CREDIT,
              true,
            );
            break;
          case OperationTransactionType.chargeback:
            // Transfer Chargeback
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_CHARGEBACK,
              true,
            );
            break;
          case OperationTransactionType.withdrawal:
            // Transfer Withdrawal
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_WITHDRAWAL,
              true,
            );
            break;
          case OperationTransactionType.debit:
            //? Exist case
            break;
          case OperationTransactionType.noApply:
            //? Exist case
            break;
        }
      } else if (statusCheckTransfer === StatusTransferEnum.APVD) {
        // Approved Transfer
        /* this.setStatsBase(
          documentStatsTransfer,
          transfer,
          StatsParamNameEnum.APPROVED_TRANSFER,
          true,
        ); */
        switch (transfer.operationType) {
          case OperationTransactionType.deposit:
            // Approved Deposit
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_DEPOSIT_APPROVED,
              true,
            );
            break;
          case OperationTransactionType.credit:
            // Approved Credit
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_CREDIT_APPROVED,
              true,
            );
            break;
          case OperationTransactionType.chargeback:
            // Approved Chargeback
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_CHARGEBACK_APPROVED,
              true,
            );
            break;
          case OperationTransactionType.withdrawal:
            // Approved Withdrawal
            this.setStatsBase(
              documentStatsTransfer,
              transfer,
              StatsParamNameEnum.TRANSFER_WITHDRAWAL_APPROVED,
              true,
            );
            break;
          case OperationTransactionType.debit:
            //? Exist
            break;
          case OperationTransactionType.noApply:
            //? Exist
            break;
        }
      }
      return documentStatsTransfer.save({ session });
    }
    return Promise.resolve(null);
  }

  async getStatsTransfer(/* query: QuerySearchAnyDto */) {
    // TODO[hender] Check stats global
    const transferRta = {
      approvalTransactions: 0,
      totalMoneyRetained: 0,
      retainedTransactions: 0,
      transactionsFtd: 0,
      totalMoneyFtd: 0,
      netAmount: 0,
      completedTransactions: 0,
      totalAmountDeposits: 0,
      totalWithdrawal: 0,
    };
    return {
      data: transferRta,
    };
  }

  // TODO[hender] Create CronJob that runs daily stats check by querying the DB
  async checkStatsPsp(transfer: TransferDocument) {
    const pspId: string = (transfer.psp?.id || transfer.psp).toString();
    const psp: PspDocument = await this.getPspDB(pspId);
    this.checkPspOrPspAccount(transfer, psp);
    psp.id = psp._id;
    this.builder.getPromisePspEventClient<PspDocument>(
      EventsNamesPspEnum.updateOne,
      psp,
    );
  }

  // TODO[hender] Create CronJob that runs daily stats check by querying the DB
  async checkStatsPspAccount(transfer: TransferDocument) {
    const pspAccountId: string = (
      transfer.pspAccount?.id || transfer.pspAccount
    ).toString();
    const pspAccount: PspAccountDocument = await this.getPspAccountDB(
      pspAccountId,
    );
    this.checkPspOrPspAccount(transfer, pspAccount);
    pspAccount.id = pspAccount._id;
    await this.builder.getPromisePspAccountEventClient<PspAccountDocument>(
      EventsNamesPspAccountEnum.updateOne,
      pspAccount,
    );
  }

  private checkPspOrPspAccount(
    transfer: TransferDocument,
    pspOrPspAccount: PspDocument | PspAccountDocument,
  ) {
    if (!transfer.hasChecked) {
      this.checkPspOrPspsAccountChecked(transfer, pspOrPspAccount);
    }
    if (transfer.operationType === OperationTransactionType.deposit) {
      if (transfer.approvedAt && !transfer.rejectedAt) {
        this.checkPspOrPspAccountApprovedPayments(transfer, pspOrPspAccount);
      }
      if (transfer.rejectedAt && !transfer.approvedAt) {
        this.checkPspOrPspAccountRejectedPayments(transfer, pspOrPspAccount);
      }
    }
  }

  private checkPspOrPspsAccountChecked(
    transfer: TransferDocument,
    pspOrPspAccount: PspDocument | PspAccountDocument,
  ) {
    transfer.hasChecked = true;
    if (transfer.operationType === OperationTransactionType.deposit) {
      pspOrPspAccount.quantityPayments =
        (pspOrPspAccount.quantityPayments || 0) + 1;
      pspOrPspAccount.totalPayments =
        (pspOrPspAccount.totalPayments || 0) + transfer.amount;
    } else if (transfer.operationType === OperationTransactionType.withdrawal) {
      pspOrPspAccount.quantityWithdrawal =
        (pspOrPspAccount.quantityWithdrawal || 0) + 1;
      pspOrPspAccount.totalWithdrawal =
        (pspOrPspAccount.totalWithdrawal || 0) + transfer.amount;
    }
    // TODO[hender-2023/09/20] Check other operation transaction types
  }

  private checkPspOrPspAccountApprovedPayments(
    transfer: TransferDocument,
    pspOrPspAccount: PspDocument | PspAccountDocument,
  ) {
    pspOrPspAccount.quantityApprovedPayments =
      (pspOrPspAccount.quantityApprovedPayments || 0) + 1;
    pspOrPspAccount.totalApprovedPayments =
      (pspOrPspAccount.totalApprovedPayments || 0) + transfer.amount;
    pspOrPspAccount.approvedPercent = pspOrPspAccount.approvedPercent || 0;
    pspOrPspAccount.approvedPercent =
      pspOrPspAccount.quantityApprovedPayments /
      pspOrPspAccount.quantityPayments;
  }

  private checkPspOrPspAccountRejectedPayments(
    transfer: TransferDocument,
    pspOrPspAccount: PspDocument | PspAccountDocument,
  ) {
    pspOrPspAccount.quantityRejectedPayments =
      (pspOrPspAccount.quantityRejectedPayments || 0) + 1;
    pspOrPspAccount.totalRejectedPayments =
      (pspOrPspAccount.totalRejectedPayments || 0) + transfer.amount;
    pspOrPspAccount.rejectedPercent = pspOrPspAccount.rejectedPercent || 0;
    pspOrPspAccount.rejectedPercent =
      pspOrPspAccount.quantityRejectedPayments /
      pspOrPspAccount.quantityPayments;
  }

  async removeAllStatsDateAffiliate(query = {}) {
    return this.libStatsDateAffiliate.removeAllData(query);
  }

  async checkAllStatsDateAffiliate(leads: Array<LeadDocument>) {
    const listStats = [];
    for (const lead of leads) {
      listStats.push(await this.checkStatsDateAffiliate(lead));
    }
    return listStats;
  }

  async checkStatsDateAffiliate(lead: LeadDocument) {
    if (lead?._id) {
      const transfersLead = await this.builder.getPromiseTransferEventClient(
        EventsNamesTransferEnum.findByLead,
        lead._id,
      );
      lead.transfers = transfersLead.list;
      return this.checkStatsDateLead(this.libStatsDateAffiliate, lead);
    }
  }

  async removeAllStatsDatePspAccount(query = {}) {
    return this.libStatsDatePspAccount.removeAllData(query);
  }

  async checkAllStatsDatePspAccount(transfers: Array<TransferDocument>) {
    const groupByLead = transfers.reduce(function (r, a) {
      if (a.lead) {
        r[a.lead?._id] = r[a.lead._id] || [];
        r[a.lead?._id].push(a);
      } else {
        //r['null'].push(a);
        Logger.debug(a, 'No lead');
      }
      return r;
    }, Object.create(null));
    for (const k in groupByLead) {
      let hasCountedLead = false;
      for (const transfer of groupByLead[k]) {
        await this.checkStatsDateTransfer(transfer, hasCountedLead);
        if (!hasCountedLead) {
          hasCountedLead = true;
        }
      }
    }
  }

  async checkStatsDatePspAccount(
    transfer: TransferDocument,
    hasCountedLead = true,
  ) {
    if (transfer?._id) {
      return this.checkStatsDateTransfer(transfer, hasCountedLead);
    }
  }

  async getGlobalStatDailyDBAffiliate(
    query?: QuerySearchAnyDto,
    dpto?: string,
  ) {
    if (!dpto) {
      dpto = (await this.getCategorySalesDB())._id;
    }
    query.where = query.where || {};
    query.where.department = dpto;
    if (query.where.dateCheck) {
      query.where.$or = [];
      query.where.$or.push({
        dateCheck: query.where.dateCheck,
      });
      query.where.$or.push({
        dateCheckCFTD: query.where.dateCheck,
      });
      query.where.$or.push({
        dateCheckFTD: query.where.dateCheck,
      });
      delete query.where.dateCheck;
    }
    return this.libStatsDateAffiliate.globalStats(query);
    //return this.libStatsDate.globalStats(query);
  }

  async findAllAffiliateStats(query: QuerySearchAnyDto) {
    const dptSales = await this.getCategorySalesDB();
    query.where = query.where || {};
    query.where.department = dptSales._id;
    return this.libStatsDateAffiliate.findAll(query);
  }

  async getGlobalStatDailyDBPspAccount(query?: QuerySearchAnyDto) {
    return this.libStatsDatePspAccount.globalStats(query);
  }

  async findAllPspAccountStats(query: QuerySearchAnyDto) {
    return this.libStatsDatePspAccount.findAll(query);
  }

  private async checkStatsDateTransfer(
    transfer: TransferDocument,
    hasCountedLead: boolean,
  ): Promise<StatsDatePspAccountDocument> {
    const inactiveStatus = await this.getStatusDB('Inactive');
    const statusId = (transfer.status._id ?? transfer.status).toString();
    if (statusId === inactiveStatus._id.toString()) {
      return;
    }
    const retentionDpt = await this.getCategoryRetentionDB();
    const lead = transfer.lead as LeadDocument;
    let isNewTransfer = false;
    let isNewLead = false;
    let documentStats: StatsDatePspAccountDocument =
      await this.getStatDailyDBTransfer(transfer, this.libStatsDatePspAccount);
    if (!documentStats?.id) {
      const dtoCreate = new StatsDateCreateDto();
      dtoCreate.affiliate = transfer.affiliate?.id ?? transfer.affiliate;
      dtoCreate.brand = transfer.businessUnit?.id ?? transfer.businessUnit;
      dtoCreate.crm = transfer.crm?.id ?? transfer.crm;
      dtoCreate.pspAccount = transfer.pspAccount?.id ?? transfer.pspAccount;
      dtoCreate.psp = transfer.psp?.id ?? transfer.psp;
      dtoCreate.country = transfer.leadCountry;
      dtoCreate.department = transfer.department;
      dtoCreate.transfers = [transfer._id];
      dtoCreate.leads = [lead._id];
      dtoCreate.sourceType =
        transfer.lead?.referralType?.id ?? transfer.lead?.referralType;
      dtoCreate.period = PeriodEnum.DAILY;
      const dates = this.getDatesTransfer(transfer);
      dtoCreate.dateCheck = dates.createdAt;
      dtoCreate.dateCheckCFTD = dates.dateCFTD;
      dtoCreate.dateCheckFTD = dates.dateFTD;
      dtoCreate.dateCheckRetention = dates.dateRetention;
      dtoCreate.dateCheckApprovedAt = dates.dateApprovedAt;
      dtoCreate.dateCheckConfirmedAt = dates.dateConfirmedAt;
      isNewTransfer = true;
      isNewLead = true;
      documentStats = await this.libStatsDatePspAccount.create(dtoCreate);
    } else {
      documentStats.transfers = documentStats.transfers || [];
      if (!documentStats.transfers?.includes(transfer._id)) {
        isNewTransfer = true;
        documentStats.transfers.push(transfer._id);
      }
      documentStats.leads = documentStats.leads || [];
      if (!documentStats.leads?.includes(lead._id)) {
        isNewLead = true;
        documentStats.leads.push(lead._id);
      }
    }
    // MAX TOTAL
    documentStats.maxTotalApprovedLead =
      documentStats.maxTotalApprovedLead ?? 0;
    documentStats.maxTotalCftd = documentStats.maxTotalCftd ?? 0;
    documentStats.maxTotalFtd = documentStats.maxTotalFtd ?? 0;
    documentStats.maxTotalTransfer = documentStats.maxTotalTransfer ?? 0;
    documentStats.maxTotalLeads = documentStats.maxTotalLeads ?? 0;
    documentStats.maxTotalRetention = documentStats.maxTotalRetention ?? 0;
    documentStats.maxTotalSales = documentStats.maxTotalSales ?? 0;
    documentStats.maxTotalChargeback = documentStats.maxTotalChargeback ?? 0;
    documentStats.maxTotalWithdrawal = documentStats.maxTotalWithdrawal ?? 0;
    // MIN TOTAL
    documentStats.minTotalApprovedLead =
      documentStats.minTotalApprovedLead || Infinity;
    documentStats.minTotalCftd = documentStats.minTotalCftd || Infinity;
    documentStats.minTotalFtd = documentStats.minTotalFtd || Infinity;
    documentStats.minTotalTransfer = documentStats.minTotalTransfer || Infinity;
    documentStats.minTotalLeads = documentStats.minTotalLeads || Infinity;
    documentStats.minTotalRetention =
      documentStats.minTotalRetention || Infinity;
    documentStats.minTotalSales = documentStats.minTotalSales || Infinity;
    documentStats.minTotalChargeback =
      documentStats.minTotalChargeback || Infinity;
    documentStats.minTotalWithdrawal =
      documentStats.minTotalWithdrawal || Infinity;
    // QUANTITY
    documentStats.quantityCftd = documentStats.quantityCftd ?? 0;
    documentStats.quantityFtd = documentStats.quantityFtd ?? 0;
    documentStats.quantityTransfer = documentStats.quantityTransfer ?? 0;
    documentStats.quantityLeads = documentStats.quantityLeads ?? 0;
    documentStats.quantityRetention = documentStats.quantityRetention ?? 0;
    documentStats.quantitySales = documentStats.quantitySales ?? 0;
    documentStats.quantityChargeback = documentStats.quantityChargeback ?? 0;
    documentStats.quantityWithdrawal = documentStats.quantityWithdrawal ?? 0;
    documentStats.quantityApprovedLead =
      documentStats.quantityApprovedLead ?? 0;
    // TOTAL
    documentStats.totalCftd = documentStats.totalCftd ?? 0;
    documentStats.totalFtd = documentStats.totalFtd ?? 0;
    documentStats.totalTransfer = documentStats.totalTransfer ?? 0;
    documentStats.totalLeads = documentStats.totalLeads ?? 0;
    documentStats.totalRetention = documentStats.totalRetention ?? 0;
    documentStats.totalSales = documentStats.totalSales ?? 0;
    documentStats.totalChargeback = documentStats.totalChargeback ?? 0;
    documentStats.totalWithdrawal = documentStats.totalWithdrawal ?? 0;
    documentStats.totalApprovedLead = documentStats.totalApprovedLead ?? 0;
    // CONVERSION
    documentStats.conversion = documentStats.conversion ?? 0;
    documentStats.conversionCftd = documentStats.conversionCftd ?? 0;
    documentStats.conversionRetention = documentStats.conversionRetention ?? 0;
    documentStats.conversionApprovedLead =
      documentStats.conversionApprovedLead ?? 0;
    // Validate Operation types for the sign
    let sign = 0;
    switch (transfer.operationType) {
      case OperationTransactionType.deposit:
      case OperationTransactionType.credit:
      case OperationTransactionType.debit:
        sign = 1;
        break;
      case OperationTransactionType.chargeback:
      case OperationTransactionType.withdrawal:
        sign = -1;
        if (OperationTransactionType.withdrawal === transfer.operationType) {
          documentStats.quantityWithdrawal++;
          documentStats.totalWithdrawal += transfer.amount;
          documentStats.minTotalWithdrawal =
            documentStats.minTotalWithdrawal > transfer.amount
              ? transfer.amount
              : documentStats.minTotalWithdrawal;
          documentStats.maxTotalWithdrawal =
            documentStats.maxTotalWithdrawal < transfer.amount
              ? transfer.amount
              : documentStats.maxTotalWithdrawal;
        } else {
          documentStats.quantityChargeback++;
          documentStats.totalChargeback += transfer.amount;
          documentStats.minTotalChargeback =
            documentStats.minTotalChargeback > transfer.amount
              ? transfer.amount
              : documentStats.minTotalChargeback;
          documentStats.maxTotalChargeback =
            documentStats.maxTotalChargeback < transfer.amount
              ? transfer.amount
              : documentStats.maxTotalChargeback;
        }
        break;
    }
    const amount = transfer.amount * sign;
    //Logger.debug(lead.email, 'Lead email before counted');
    if (!hasCountedLead) {
      //Logger.debug(lead.email, 'Lead email counted');
      documentStats.quantityLeads++;
      if (transfer.hasApproved) {
        if (lead?.crmDepartment.toString() === retentionDpt._id.toString()) {
          // Is Retention
          documentStats.quantityRetention++;
        } else {
          // Is Sales
          documentStats.quantitySales++;
          if (lead.dateFTD) {
            // Is FTD
            documentStats.quantityFtd++;
            if (lead.showToAffiliate) {
              documentStats.quantityApprovedLead++;
            }
          } else if (lead.dateCFTD) {
            // Is CFTD
            documentStats.quantityCftd++;
          }
        }
      }
    }
    if (
      isNewTransfer &&
      transfer.operationType !== OperationTransactionType.credit
    ) {
      documentStats.quantityTransfer++;
    }
    if (transfer.hasApproved) {
      documentStats.totalLeads += amount;
      documentStats.maxTotalLeads =
        documentStats.maxTotalLeads < amount
          ? amount
          : documentStats.maxTotalLeads;
      documentStats.minTotalLeads =
        documentStats.minTotalLeads > amount
          ? amount
          : documentStats.minTotalLeads;
      if (transfer.operationType !== OperationTransactionType.credit) {
        documentStats.totalTransfer += amount;
        documentStats.minTotalTransfer =
          documentStats.minTotalTransfer > amount
            ? amount
            : documentStats.minTotalTransfer;
        documentStats.maxTotalTransfer =
          documentStats.maxTotalTransfer < amount
            ? amount
            : documentStats.maxTotalTransfer;
      }
      if (lead.crmDepartment.toString() === retentionDpt._id.toString()) {
        // Is Retention
        documentStats.totalRetention += amount;
        documentStats.maxTotalRetention =
          documentStats.maxTotalRetention < amount
            ? amount
            : documentStats.maxTotalRetention;
        documentStats.minTotalRetention =
          documentStats.minTotalRetention > amount
            ? amount
            : documentStats.minTotalRetention;
      } else {
        // Is Sales
        documentStats.totalSales += amount;
        documentStats.maxTotalSales =
          documentStats.maxTotalSales < amount
            ? amount
            : documentStats.maxTotalSales;
        documentStats.minTotalSales =
          documentStats.minTotalSales > amount
            ? amount
            : documentStats.minTotalSales;
        if (lead.dateFTD) {
          // Is FTD
          documentStats.totalFtd += amount;
          documentStats.maxTotalFtd =
            documentStats.maxTotalFtd < amount
              ? amount
              : documentStats.maxTotalFtd;
          documentStats.minTotalFtd =
            documentStats.minTotalFtd > amount
              ? amount
              : documentStats.minTotalFtd;
          if (lead.showToAffiliate) {
            documentStats.totalApprovedLead += amount;
            documentStats.maxTotalApprovedLead =
              documentStats.maxTotalApprovedLead < amount
                ? amount
                : documentStats.maxTotalApprovedLead;
            documentStats.minTotalApprovedLead =
              documentStats.minTotalApprovedLead > amount
                ? amount
                : documentStats.minTotalApprovedLead;
          }
        } else if (lead.dateCFTD) {
          // Is CFTD
          documentStats.totalCftd += amount;
          documentStats.maxTotalCftd =
            documentStats.maxTotalCftd < amount
              ? amount
              : documentStats.maxTotalCftd;
          documentStats.minTotalCftd =
            documentStats.minTotalCftd > amount
              ? amount
              : documentStats.minTotalCftd;
        }
      }
    }
    return documentStats.save();
  }

  private async checkStatsDateLead(
    serviceStats: StatsDateMongoose,
    lead: LeadDocument,
  ): Promise<StatsDateAffiliateDocument> {
    const retentionDpt = await this.getCategoryRetentionDB();
    let documentStats: StatsDateAffiliateDocument =
      await this.getStatDailyDBLead(lead, serviceStats);
    if (!documentStats?.id) {
      const dtoCreate = new StatsDateCreateDto();
      dtoCreate.affiliate = lead.affiliate?.id ?? lead.affiliate;
      dtoCreate.brand = lead.brand?.id ?? lead.brand;
      dtoCreate.crm = lead.crm?.id ?? lead.crm;
      dtoCreate.country = lead.country;
      dtoCreate.department = lead.crmDepartment;
      dtoCreate.sourceType = lead?.referralType?.id ?? lead?.referralType;
      dtoCreate.period = PeriodEnum.DAILY;
      const dates = this.getDatesLead(lead);
      dtoCreate.dateCheck = dates.createdAt;
      dtoCreate.dateCheckCFTD = dates.dateCFTD;
      dtoCreate.dateCheckFTD = dates.dateFTD;
      dtoCreate.dateCheckRetention = dates.dateRetention;
      dtoCreate.leads = [lead._id];
      documentStats = await serviceStats.create(dtoCreate);
    } else {
      documentStats.leads = documentStats.leads || [];
      if (!documentStats.leads?.includes(lead._id)) {
        documentStats.leads.push(lead._id);
      }
    }
    // MAX TOTAL
    documentStats.maxTotalApprovedLead =
      documentStats.maxTotalApprovedLead ?? 0;
    documentStats.maxTotalCftd = documentStats.maxTotalCftd ?? 0;
    documentStats.maxTotalFtd = documentStats.maxTotalFtd ?? 0;
    documentStats.maxTotalTransfer = documentStats.maxTotalTransfer ?? 0;
    documentStats.maxTotalLeads = documentStats.maxTotalLeads ?? 0;
    documentStats.maxTotalRetention = documentStats.maxTotalRetention ?? 0;
    documentStats.maxTotalSales = documentStats.maxTotalSales ?? 0;
    // MIN TOTAL
    documentStats.minTotalApprovedLead =
      documentStats.minTotalApprovedLead || Infinity;
    documentStats.minTotalCftd = documentStats.minTotalCftd || Infinity;
    documentStats.minTotalFtd = documentStats.minTotalFtd || Infinity;
    documentStats.minTotalTransfer = documentStats.minTotalTransfer || Infinity;
    documentStats.minTotalLeads = documentStats.minTotalLeads || Infinity;
    documentStats.minTotalRetention =
      documentStats.minTotalRetention || Infinity;
    documentStats.minTotalSales = documentStats.minTotalSales || Infinity;
    // QUANTITY
    documentStats.quantityCftd = documentStats.quantityCftd ?? 0;
    documentStats.quantityFtd = documentStats.quantityFtd ?? 0;
    documentStats.quantityTransfer = documentStats.quantityTransfer ?? 0;
    documentStats.quantityLeads = documentStats.quantityLeads ?? 0;
    documentStats.quantityRetention = documentStats.quantityRetention ?? 0;
    documentStats.quantitySales = documentStats.quantitySales ?? 0;
    documentStats.quantityApprovedLead =
      documentStats.quantityApprovedLead ?? 0;
    // TOTAL
    documentStats.totalCftd = documentStats.totalCftd ?? 0;
    documentStats.totalFtd = documentStats.totalFtd ?? 0;
    documentStats.totalTransfer = documentStats.totalTransfer ?? 0;
    documentStats.totalLeads = documentStats.totalLeads ?? 0;
    documentStats.totalRetention = documentStats.totalRetention ?? 0;
    documentStats.totalSales = documentStats.totalSales ?? 0;
    documentStats.totalApprovedLead = documentStats.totalApprovedLead ?? 0;
    // CONVERSION
    documentStats.conversion = documentStats.conversion ?? 0;
    documentStats.conversionApprovedLead =
      documentStats.conversionApprovedLead ?? 0;
    // OPERATIONS
    documentStats.quantityLeads++;
    if (lead.crmDepartment?.toString() === retentionDpt._id.toString()) {
      // Is Retention
      documentStats.quantityRetention++;
    } else {
      // Is Sales
      documentStats.quantitySales++;
      if (lead.dateFTD) {
        // Is FTD
        documentStats.quantityFtd++;
        if (lead.showToAffiliate) {
          documentStats.quantityApprovedLead++;
        }
      } else if (lead.dateCFTD) {
        // Is CFTD
        documentStats.quantityCftd++;
      }
    }
    if (isArray(lead.transfers) && !isEmpty(lead.transfers)) {
      const inactiveStatus = await this.getStatusDB('Inactive');
      for (const transfer of lead.transfers) {
        const statusId = (transfer.status._id ?? transfer.status).toString();
        if (statusId === inactiveStatus._id.toString()) {
          continue;
        }
        let sign = 0;
        switch (transfer.operationType) {
          case OperationTransactionType.deposit:
          case OperationTransactionType.credit:
          case OperationTransactionType.debit:
            sign = 1;
            break;
          case OperationTransactionType.chargeback:
          case OperationTransactionType.withdrawal:
            sign = -1;
            if (
              OperationTransactionType.withdrawal === transfer.operationType
            ) {
              documentStats.quantityWithdrawal++;
              documentStats.totalWithdrawal += transfer.amount;
              documentStats.minTotalWithdrawal =
                documentStats.minTotalWithdrawal > transfer.amount
                  ? transfer.amount
                  : documentStats.minTotalWithdrawal;
              documentStats.maxTotalWithdrawal =
                documentStats.maxTotalWithdrawal < transfer.amount
                  ? transfer.amount
                  : documentStats.maxTotalWithdrawal;
            } else {
              documentStats.quantityChargeback++;
              documentStats.totalChargeback += transfer.amount;
              documentStats.minTotalChargeback =
                documentStats.minTotalChargeback > transfer.amount
                  ? transfer.amount
                  : documentStats.minTotalChargeback;
              documentStats.maxTotalChargeback =
                documentStats.maxTotalChargeback < transfer.amount
                  ? transfer.amount
                  : documentStats.maxTotalChargeback;
            }
            break;
        }
        const amount = transfer.amount * sign;
        if (transfer.hasApproved) {
          documentStats.totalLeads += amount;
          documentStats.maxTotalLeads =
            documentStats.maxTotalLeads < amount
              ? amount
              : documentStats.maxTotalLeads;
          documentStats.minTotalLeads =
            documentStats.minTotalLeads > amount
              ? amount
              : documentStats.minTotalLeads;
          if (transfer.operationType !== OperationTransactionType.credit) {
            documentStats.quantityTransfer++;
            documentStats.totalTransfer += amount;
            documentStats.minTotalTransfer =
              documentStats.minTotalTransfer > amount
                ? amount
                : documentStats.minTotalTransfer;
            documentStats.maxTotalTransfer =
              documentStats.maxTotalTransfer < amount
                ? amount
                : documentStats.maxTotalTransfer;
          }
          if (lead.crmDepartment?.toString() === retentionDpt._id.toString()) {
            documentStats.totalRetention += amount;
            documentStats.maxTotalRetention =
              documentStats.maxTotalRetention < amount
                ? amount
                : documentStats.maxTotalRetention;
            documentStats.minTotalRetention =
              documentStats.minTotalRetention > amount
                ? amount
                : documentStats.minTotalRetention;
          } else {
            // Is Sales
            documentStats.totalSales += amount;
            documentStats.maxTotalSales =
              documentStats.maxTotalSales < amount
                ? amount
                : documentStats.maxTotalSales;
            documentStats.minTotalSales =
              documentStats.minTotalSales > amount
                ? amount
                : documentStats.minTotalSales;
            if (lead.dateFTD) {
              // Is FTD
              documentStats.totalFtd += amount;
              documentStats.maxTotalFtd =
                documentStats.maxTotalFtd < amount
                  ? amount
                  : documentStats.maxTotalFtd;
              documentStats.minTotalFtd =
                documentStats.minTotalFtd > amount
                  ? amount
                  : documentStats.minTotalFtd;
              if (lead.showToAffiliate) {
                documentStats.totalApprovedLead += amount;
                documentStats.maxTotalApprovedLead =
                  documentStats.maxTotalApprovedLead < amount
                    ? amount
                    : documentStats.maxTotalApprovedLead;
                documentStats.minTotalApprovedLead =
                  documentStats.minTotalApprovedLead > amount
                    ? amount
                    : documentStats.minTotalApprovedLead;
              }
            } else if (lead.dateCFTD) {
              // Is CFTD
              documentStats.totalCftd += amount;
              documentStats.maxTotalCftd =
                documentStats.maxTotalCftd < amount
                  ? amount
                  : documentStats.maxTotalCftd;
              documentStats.minTotalCftd =
                documentStats.minTotalCftd > amount
                  ? amount
                  : documentStats.minTotalCftd;
            }
          }
        }
      }
    }

    try {
      return documentStats.save();
    } catch (error) {
      Logger.error(error, 'Error to create stats');
      return null;
    }
  }

  private async checkStatsDateByLead(
    serviceStats: StatsDateMongoose,
    lead: LeadDocument,
    transfer?: TransferDocument,
  ): Promise<StatsDateAffiliateDocument> {
    const retentionDpt = await this.getCategoryRetentionDB();
    const documentStats: StatsDateAffiliateDocument =
      await this.getDocumentStats(lead, serviceStats);
    this.checkLeadMinMaxQuantityTotal(documentStats, lead, transfer);
    this.checkTransferMinMaxQuantityTotal(documentStats, lead, transfer);
    if (lead.dateFTD) {
      this.checkFtdMinMaxQuantityTotal(documentStats, lead, transfer);
    } else if (lead.dateCFTD) {
      this.checkCftdMinMaxQuantityTotal(documentStats, lead, transfer);
    }
    if (lead.crmDepartment._id.toString() == retentionDpt._id.toString()) {
      this.checkRetentionMinMaxQuantityTotal(documentStats, lead, transfer);
    } else {
      this.checkSalesMinMaxQuantityTotal(documentStats, lead, transfer);
    }
    try {
      return documentStats.save();
    } catch (error) {
      Logger.error(error, 'Error to create stats');
      return null;
    }
  }

  private async getDocumentStatDates(
    lead,
    dateCheck,
    session: ClientSession = null,
  ) {
    let documentStats: StatsDateDocument = await this.getStatDateDocument(
      lead,
      dateCheck,
      session,
    );
    if (!documentStats?.id) {
      const dtoCreate = new StatsDateAllCreateDto();
      dtoCreate.affiliate = lead.affiliate?.id ?? lead.affiliate;
      dtoCreate.brand = lead.brand?.id ?? lead.brand;
      dtoCreate.crm = lead.crm?.id ?? lead.crm;
      dtoCreate.country = lead.country;
      dtoCreate.department = lead.crmDepartment;
      dtoCreate.sourceType = lead?.referralType?.id ?? lead?.referralType;
      dtoCreate.period = PeriodEnum.DAILY;
      dtoCreate.dateCheck = dateCheck;
      documentStats = await this.libStatsDate.create(dtoCreate, session);
    }
    return documentStats;
  }

  private async getStatDateDocument(lead, date, session: ClientSession = null) {
    const where = {
      country: lead.country ?? lead.country,
      sourceType: lead.referralType?._id ?? lead.referralType,
      affiliate: lead.affiliate?._id ?? lead.affiliate,
      brand: lead.brand?._id ?? lead.brand,
      crm: lead.crm?._id ?? lead.crm,
      department: lead?.crmDepartment,
      dateCheck: date,
    };
    const documentStats: ResponsePaginator<StatsDateDocument> =
      await this.libStatsDate.findAll(
        {
          where: where,
        },
        session,
      );
    return documentStats.list[0];
  }

  private async getDocumentStats(lead, serviceStats) {
    let documentStats: StatsDateAffiliateDocument =
      await this.getStatDailyDBLead(lead, serviceStats);
    if (!documentStats?.id) {
      const dtoCreate = new StatsDateCreateDto();
      dtoCreate.affiliate = lead.affiliate?.id ?? lead.affiliate;
      dtoCreate.brand = lead.brand?.id ?? lead.brand;
      dtoCreate.crm = lead.crm?.id ?? lead.crm;
      dtoCreate.country = lead.country;
      dtoCreate.department = lead.crmDepartment;
      dtoCreate.sourceType = lead?.referralType?.id ?? lead?.referralType;
      dtoCreate.period = PeriodEnum.DAILY;
      const date = this.getDateResetToStartDay(lead.createdAt);
      dtoCreate.dateCheck = date;
      documentStats = await serviceStats.create(dtoCreate);
    }
    return documentStats;
  }

  private checkLeadMinMaxQuantityTotal(
    stats,
    lead,
    transfer?: TransferDocument,
  ) {
    return this.checkMinMaxQuantityTotalBasic('Leads', stats, lead, transfer);
  }
  private checkTransferMinMaxQuantityTotal(
    stats,
    lead,
    transfer?: TransferDocument,
  ) {
    return this.checkMinMaxQuantityTotalBasic(
      'Transfer',
      stats,
      lead,
      transfer,
    );
  }
  private checkCftdMinMaxQuantityTotal(
    stats,
    lead,
    transfer?: TransferDocument,
  ) {
    return this.checkMinMaxQuantityTotalBasic('Cftd', stats, lead, transfer);
  }
  private checkFtdMinMaxQuantityTotal(
    stats,
    lead,
    transfer?: TransferDocument,
  ) {
    return this.checkMinMaxQuantityTotalBasic('Ftd', stats, lead, transfer);
  }
  private checkRetentionMinMaxQuantityTotal(
    stats,
    lead,
    transfer?: TransferDocument,
  ) {
    return this.checkMinMaxQuantityTotalBasic(
      'Retention',
      stats,
      lead,
      transfer,
    );
  }
  private checkSalesMinMaxQuantityTotal(
    stats,
    lead,
    transfer?: TransferDocument,
  ) {
    return this.checkMinMaxQuantityTotalBasic('Sales', stats, lead, transfer);
  }
  private checkMinMaxQuantityTotalBasic(
    attrName: string,
    stats,
    lead,
    transfer,
  ) {
    // Start MAX
    stats[`maxTotal${attrName}`] = stats[`maxTotal${attrName}`] ?? 0;
    // Start MIN
    stats[`minTotal${attrName}`] = [`minTotal${attrName}`] || Infinity;
    // Start QUANTITY
    stats[`quantity${attrName}`] = stats[`quantity${attrName}`] ?? 0;
    // Start TOTAL
    stats[`total${attrName}`] = stats[`quantity${attrName}`] ?? 0;
    if (transfer) {
      stats = this.updateTransferToStats(stats, attrName, transfer);
    } else if (isArray(lead.transfers) && !isEmpty(lead.transfers)) {
      for (const tx of lead.transfers) {
        stats = this.updateTransferToStats(stats, attrName, tx);
      }
    }
    return stats;
  }

  private updateTransferToStats(stats, attrName, transfer) {
    const sign = this.getSignOperation(transfer.operationType);
    const amount = transfer.amount * sign;
    // Calc TOTAL
    stats[`total${attrName}`] += amount;
    // Calc MAX
    stats[`maxTotal${attrName}`] =
      stats[`maxTotal${attrName}`] < amount
        ? amount
        : stats[`maxTotal${attrName}`];
    // calc MIN
    stats[`minTotal${attrName}`] =
      stats[`minTotal${attrName}`] > amount
        ? amount
        : stats[`minTotal${attrName}`];
    return stats;
  }

  private getSignOperation(operationType: OperationTransactionType) {
    switch (operationType) {
      case OperationTransactionType.deposit:
      case OperationTransactionType.credit:
      case OperationTransactionType.debit:
        return 1;
      case OperationTransactionType.chargeback:
      case OperationTransactionType.withdrawal:
        return -1;
    }
  }

  private async getPspAccountDB(id: string): Promise<PspAccountDocument> {
    return this.builder.getPromisePspAccountEventClient<PspAccountDocument>(
      EventsNamesPspAccountEnum.findOneById,
      id,
    );
  }

  private async getPspDB(id: string): Promise<PspDocument> {
    return this.builder.getPromisePspEventClient<PspDocument>(
      EventsNamesPspEnum.findOneById,
      id,
    );
  }

  private async getCategoryRetentionDB(): Promise<CategoryDocument> {
    return this.getCategoryDB('Retention', TagEnum.DEPARTMENT);
  }

  private async getCategorySalesDB(): Promise<CategoryDocument> {
    return this.getCategoryDB('Sales', TagEnum.DEPARTMENT);
  }

  private async getCategoryWithdrawalDB(): Promise<CategoryDocument> {
    return this.getCategoryDB('Withdrawal', TagEnum.MONETARY_TRANSACTION_TYPE);
  }

  private async getStatusLeadDB(): Promise<StatusDocument> {
    return this.getStatusDB('Active');
  }

  private async getStatusCftdDB(): Promise<StatusDocument> {
    return this.getStatusDB('CFTD');
  }

  private async getStatusFtdDB(): Promise<StatusDocument> {
    return this.getStatusDB('FTD');
  }

  private async getStatusDB(statusName: string): Promise<StatusDocument> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      statusName,
    );
  }

  private async getCategoryDB(
    categoryName: string,
    type = TagEnum.CATEGORY,
  ): Promise<CategoryDocument> {
    return this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: categoryName,
        type: type,
      },
    );
  }

  private getDatesTransfer(transfer: TransferDocument) {
    const lead = transfer.lead;
    return {
      createdAt: this.getDateResetToStartDay(
        new Date(transfer.createdAt).toISOString(),
      ),
      dateApprovedAt: transfer.approvedAt
        ? this.getDateResetToStartDay(
            new Date(transfer.approvedAt).toISOString(),
          )
        : undefined,
      dateConfirmedAt: transfer.confirmedAt
        ? this.getDateResetToStartDay(
            new Date(transfer.confirmedAt).toISOString(),
          )
        : undefined,
      dateCFTD: lead?.dateCFTD
        ? this.getDateResetToStartDay(new Date(lead?.dateCFTD).toISOString())
        : undefined,
      dateFTD: lead?.dateFTD
        ? this.getDateResetToStartDay(new Date(lead?.dateFTD).toISOString())
        : undefined,
      dateRetention: lead?.dateRetention
        ? this.getDateResetToStartDay(
            new Date(lead?.dateRetention).toISOString(),
          )
        : undefined,
    };
  }

  private async getStatDailyDBTransfer(
    transfer: TransferDocument,
    serviceStats: StatsDatePspAccountServiceMongooseService,
  ): Promise<StatsDatePspAccountDocument> {
    const dates = this.getDatesTransfer(transfer);
    const where = {
      sourceType: transfer.lead.referralType?.id ?? transfer.lead.referralType,
      affiliate: transfer.affiliate?.id ?? transfer.affiliate,
      country: transfer.leadCountry ?? transfer.leadCountry,
      brand: transfer.businessUnit?.id ?? transfer.businessUnit,
      crm: transfer.crm?.id ?? transfer.crm,
      department: transfer.department?.id ?? transfer.department,
      psp: transfer.psp?.id ?? transfer.psp,
      pspAccount: transfer.psp?.id ?? transfer.pspAccount,
      dateCheck: dates.createdAt,
      dateCheckApprovedAt: dates.dateApprovedAt,
      dateCheckConfirmedAt: dates.dateConfirmedAt,
    };
    const statsDaily = await serviceStats.findAll({
      where,
    });
    return statsDaily.list[0];
  }

  private getDatesLead(lead: LeadDocument) {
    return {
      createdAt: this.getDateResetToStartDay(
        new Date(lead.createdAt).toISOString(),
      ),
      dateCFTD: lead.dateCFTD
        ? this.getDateResetToStartDay(new Date(lead.dateCFTD).toISOString())
        : undefined,
      dateFTD: lead.dateFTD
        ? this.getDateResetToStartDay(new Date(lead.dateFTD).toISOString())
        : undefined,
      dateRetention: lead.dateRetention
        ? this.getDateResetToStartDay(
            new Date(lead.dateRetention).toISOString(),
          )
        : undefined,
    };
  }

  private async getStatDailyDBLead(
    lead: LeadDocument,
    serviceStats: StatsDateMongoose,
    transfer: Transfer = null,
  ): Promise<StatsDateAffiliateDocument> {
    const dates = this.getDatesLead(lead);
    const where = {
      sourceType: lead.referralType?.id ?? lead.referralType,
      affiliate: lead.affiliate?.id ?? lead.affiliate,
      country: lead.country ?? lead.country,
      brand: lead.brand?.id ?? lead.brand,
      crm: lead.crm?.id ?? lead.crm,
      department: lead?.crmDepartment,
      dateCheck: dates.createdAt,
      dateCheckCFTD: dates.dateCFTD,
      dateCheckFTD: dates.dateFTD,
      dateCheckRetention: dates.dateRetention,
    };
    /* if (transfer) {
      where['pspAccount'] = transfer?.pspAccount;
      where['psp'] = transfer?.psp;
    } */
    const statsDaily = await serviceStats.findAll({
      where: where,
    });
    return statsDaily.list[0];
  }

  private getDateResetToStartDay(dateString: string) {
    try {
      const date = CommonService.getDateFromOutside(dateString, true);
      return date;
    } catch (err) {
      throw new BadRequestException('Must be a date string');
    }
  }

  async getStatsDateAffiliate(affiliateId?: string) {
    return this.getStatsDateAffiliates({
      where: {
        affiliate: affiliateId,
      },
    });
  }

  async getStatsDateRetention(query: QuerySearchAnyDto) {
    const dptRetention = await this.getCategoryRetentionDB();
    return this.getStatsDateAffiliates(query, dptRetention._id);
  }

  async getStatsDateAffiliates(query: QuerySearchAnyDto, dpto?: string) {
    if (!dpto) {
      const dptSales = await this.getCategorySalesDB();
      dpto = dptSales._id;
    }
    query.where = query.where ?? {};
    query.where.department = dpto;
    if (query.where.dateCheck) {
      query.where.$or = [];
      query.where.$or.push({
        dateCheck: query.where.dateCheck,
      });
      query.where.$or.push({
        dateCheckCFTD: query.where.dateCheck,
      });
      query.where.$or.push({
        dateCheckFTD: query.where.dateCheck,
      });
      delete query.where.dateCheck;
    }
    const rta = await this.libStatsDateAffiliate.groupByAffiliate(query);
    for (const item of rta) {
      delete item._id;
    }
    return rta;
  }

  async getStatsDatePspAccount(pspAccountId?: string) {
    return this.getStatsDatePspAccounts({
      where: {
        pspAccount: pspAccountId,
      },
    });
  }

  async getStatsDatePspAccountRetention(query: QuerySearchAnyDto) {
    const dptRetention = await this.getCategoryRetentionDB();
    return this.getStatsDatePspAccounts(query, dptRetention._id);
  }

  async getStatsDatePspAccounts(query: QuerySearchAnyDto, dpto?: string) {
    /* if (!dpto) {
      const dptSales = await this.getCategorySalesDB();
      dpto = dptSales._id;
    } */
    const rta = await this.libStatsDatePspAccount.groupByPspAccount(query);
    const lists = {};
    for (const item of rta) {
      if (
        //query?.relations?.includes('pspAccount') &&
        item.pspAccount &&
        !item.pspAccount.name
      ) {
        if (!lists[item.pspAccount]) {
          lists[item.pspAccount] =
            await this.builder.getPromisePspAccountEventClient(
              EventsNamesPspAccountEnum.findOneById,
              item.pspAccount,
            );
        }
        item.pspAccount = lists[item.pspAccount];
      }
      if (
        //query?.relations?.includes('brand') &&
        item.brand &&
        !item.brand.name
      ) {
        if (!lists[item.brand]) {
          lists[item.brand] =
            await this.builder.getPromiseBusinessUnitEventClient(
              EventsNamesBusinessUnitEnum.findOneById,
              item.brand,
            );
        }
        item.brand = lists[item.brand];
      }
      if (
        //query?.relations?.includes('department') &&
        item.department &&
        !item.department.name
      ) {
        if (!lists[item.brand]) {
          lists[item.brand] = await this.builder.getPromiseCategoryEventClient(
            EventsNamesCategoryEnum.findOneById,
            item.department,
          );
        }
        item.department = lists[item.brand];
      }
      delete item._id;
    }
    return rta;
  }
}
