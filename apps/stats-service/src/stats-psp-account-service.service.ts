import { BuildersService } from '@builder/builders';
import { CategoryDocument } from '@category/category/entities/mongoose/category.schema';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { BasicMicroserviceService } from '@common/common/models/basic.microservices.service';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, Ctx, RmqContext } from '@nestjs/microservices';
import { PspAccountDocument } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { StatsDateCreateDto } from '@stats/stats/dto/stats.date.create.dto';
import { StatsDateAffiliateDocument } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { StatsDatePspAccountDocument } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { StatsDatePspAccountServiceMongooseService } from '@stats/stats/stats.date.psp.account.service.mongoose.service';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import {
  Transfer,
  TransferDocument,
} from '@transfer/transfer/entities/mongoose/transfer.schema';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesPspAccountEnum from 'apps/psp-service/src/enum/events.names.psp.acount.enum';
import EventsNamesPspEnum from 'apps/psp-service/src/enum/events.names.psp.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import { isDate, isDateString } from 'class-validator';
import { firstValueFrom } from 'rxjs';
import { StatsDateDocuments, StatsDateMongoose } from './enum/stats.date.type';

@Injectable()
export class StatsPspAccountServiceService
  implements BasicMicroserviceService<StatsDateDocuments>
{
  private builder: BuildersService;
  private eventClient: ClientProxy;
  private statusCftd: StatusDocument;
  private statusFtd: StatusDocument;
  constructor(
    @Inject(BuildersService)
    builder: BuildersService,

    @Inject(StatsDatePspAccountServiceMongooseService)
    private libStatsDatePspAccount: StatsDatePspAccountServiceMongooseService,
  ) {
    this.builder = builder;
    this.eventClient = builder.getEventClient();
  }
  getSearchText(query: QuerySearchAnyDto) {
    throw new Error('Method not implemented.');
  }
  findAll(
    query: QuerySearchAnyDto,
    context?: any,
  ): Promise<ResponsePaginator<StatsDateDocuments>> {
    return this.findAllPspAccountStats(query);
  }
  findOneById(id: string, context?: any): Promise<StatsDateDocuments> {
    throw new Error('Method not implemented.');
  }
  createOne(
    createDto: CreateAnyDto,
    context?: any,
  ): Promise<StatsDateDocuments> {
    throw new Error('Method not implemented.');
  }
  createMany(
    createDto: CreateAnyDto[],
    context?: any,
  ): Promise<StatsDateDocuments[]> {
    throw new Error('Method not implemented.');
  }
  updateOne(
    updateDto: UpdateAnyDto,
    context?: any,
  ): Promise<StatsDateDocuments> {
    throw new Error('Method not implemented.');
  }
  updateMany(
    updateDto: UpdateAnyDto[],
    context?: any,
  ): Promise<StatsDateDocuments[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyById(
    ids: UpdateAnyDto[],
    context?: any,
  ): Promise<StatsDateDocuments[]> {
    throw new Error('Method not implemented.');
  }
  deleteOneById(id: string, context?: any): Promise<StatsDateDocuments> {
    throw new Error('Method not implemented.');
  }
  download(
    query: QuerySearchAnyDto,
    context?: any,
  ): Promise<StatsDateDocuments[]> {
    throw new Error('Method not implemented.');
  }
  getRta(rta: any, @Ctx() ctx: any) {
    throw new Error('Method not implemented.');
  }
  findAllEvent(query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  downloadEvent(query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  findOneByIdEvent(id: string, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  createOneEvent(createActivityDto: CreateAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  createManyEvent(createActivitysDto: CreateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  updateOneEvent(updateActivityDto: UpdateAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  updateManyEvent(updateActivitysDto: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  deleteManyByIdEvent(ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  deleteOneByIdEvent(id: string, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }

  async createStat(statCreate: StatsDateCreateDto) {
    return this.libStatsDatePspAccount.create(statCreate);
  }

  private async getStatusCftd(): Promise<StatusDocument> {
    if (!this.statusCftd) {
      this.statusCftd = await this.getStatusCftdDB();
    }
    return this.statusCftd;
  }

  private async getStatusFtd(): Promise<StatusDocument> {
    if (!this.statusFtd) {
      this.statusFtd = await this.getStatusFtdDB();
    }
    return this.statusFtd;
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

  async removeAllStatsDatePspAccount(query = {}) {
    return this.libStatsDatePspAccount.removeAllData(query);
  }

  async checkAllStatsDatePspAccount(transfers: Array<TransferDocument>) {
    const groupByLead = transfers.reduce(function (r, a) {
      r[a.lead._id] = r[a.lead._id] || [];
      r[a.lead._id].push(a);
      return r;
    }, Object.create(null));
    for (const transferList of Object.values<Array<TransferDocument>>(
      groupByLead,
    )) {
      let hasCountedLead = false;
      for (const transfer of transferList) {
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
      dtoCreate.sourceType =
        transfer.lead?.referralType?.id ?? transfer.lead?.referralType;
      dtoCreate.period = PeriodEnum.DAILY;
      const date = this.getDateResetToStartDay(transfer.createdAt);
      dtoCreate.dateCheck = date;
      documentStats = await this.libStatsDatePspAccount.create(dtoCreate);
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
      if (!hasCountedLead) {
        documentStats.quantityLeads++;
        if (lead.crmDepartment?.toString() === retentionDpt._id.toString()) {
          // Is Retention
          documentStats.quantityRetention++;
        } else {
          // Is Sales
          documentStats.quantitySales++;
          // CFTD and FTD
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
        hasCountedLead = true;
      }
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
      // RETENTION and SALES
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
      }
      // CFTD AND FTD
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
    return documentStats.save();
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
    return this.getPromiseEventClient(
      EventsNamesStatusEnum.findOneByName,
      statusName,
    );
  }

  private async getCategoryDB(
    categoryName: string,
    type = TagEnum.CATEGORY,
  ): Promise<CategoryDocument> {
    return this.getPromiseEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: categoryName,
        type: type,
      },
    );
  }

  private async getStatDailyDBTransfer(
    transfer: TransferDocument,
    serviceStats: StatsDatePspAccountServiceMongooseService,
  ): Promise<StatsDatePspAccountDocument> {
    const date = this.getDateResetToStartDay(transfer.createdAt);
    const where = {
      sourceType: transfer.lead.referralType?.id ?? transfer.lead.referralType,
      affiliate: transfer.affiliate?.id ?? transfer.affiliate,
      country: transfer.leadCountry ?? transfer.leadCountry,
      brand: transfer.businessUnit?.id ?? transfer.businessUnit,
      crm: transfer.crm?.id ?? transfer.crm,
      department: transfer.department?.id ?? transfer.department,
      psp: transfer.psp?.id ?? transfer.psp,
      pspAccount: transfer.psp?.id ?? transfer.pspAccount,
      dateCheck: date,
    };
    const statsDaily = await serviceStats.findAll({
      where,
    });
    return statsDaily.list[0];
  }

  private async getStatDailyDBLead(
    lead: LeadDocument,
    serviceStats: StatsDateMongoose,
    transfer: Transfer = null,
  ): Promise<StatsDateAffiliateDocument> {
    const date = this.getDateResetToStartDay(lead.createdAt);
    const where = {
      sourceType: lead.referralType?.id ?? lead.referralType,
      affiliate: lead.affiliate?.id ?? lead.affiliate,
      country: lead.country ?? lead.country,
      brand: lead.brand?.id ?? lead.brand,
      crm: lead.crm?.id ?? lead.crm,
      department: lead?.crmDepartment,
      dateCheck: date,
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

  private getDateResetToStartDay(dateString: string | Date) {
    if (!isDateString(dateString) && !isDate(dateString)) {
      throw new BadRequestException('Must be a date string');
    }
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  private async getLeadDB(transfer: TransferDocument): Promise<LeadDocument> {
    return this.getPromiseEventClient(
      EventsNamesLeadEnum.findOneById,
      transfer.lead?.id,
    );
  }

  private async getPromiseEventClient(eventName: string, data: any) {
    return firstValueFrom(this.eventClient.send(eventName, data));
  }

  async getStatsDatePspAccount(pspAccountId?: string) {
    return this.getStatsDatePspAccounts({
      where: {
        pspAccount: pspAccountId,
      },
    });
  }

  async getStatsDatePspAccounts(query: QuerySearchAnyDto) {
    const rta = await this.libStatsDatePspAccount.groupByPspAccount(query);
    for (const item of rta) {
      if (item.pspAccount) {
        item.pspAccount = await this.builder.getPromisePspAccountEventClient(
          EventsNamesPspAccountEnum.findOneById,
          item.pspAccount,
        );
      }
      delete item._id;
    }
    return rta;
  }
}
