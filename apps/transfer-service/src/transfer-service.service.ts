import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BuildersService } from '@builder/builders';
import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import { CommonService } from '@common/common';
import { StatusCashierEnum } from '@common/common/enums/StatusCashierEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { BasicMicroserviceService } from '@common/common/models/basic.microservices.service';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import { LatamCashierPaymentResponse } from '@integration/integration/payment/latam-cashier/domain/latamcashier.payment.response';
import { LeadUpdateDto } from '@lead/lead/dto/lead.update.dto';
import { LeadInterface } from '@lead/lead/entities/lead.interface';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, Ctx, RmqContext } from '@nestjs/microservices';
import { PersonInterface } from '@person/person/entities/PersonInterface';
import {
  PspAccount,
  PspAccountDocument,
} from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { PspAccountInterface } from '@psp-account/psp-account/entities/psp-account.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { StatsDateCreateDto } from '@stats/stats/dto/stats.date.create.dto';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import { StatusInterface } from '@status/status/entities/status.interface';
import { TransferServiceMongooseService } from '@transfer/transfer';
import { TransferCreateDto } from '@transfer/transfer/dto/transfer.create.dto';
import { TransferUpdateDto } from '@transfer/transfer/dto/transfer.update.dto';
import { TransferUpdateFromLatamCashierDto } from '@transfer/transfer/dto/transfer.update.from.latamcashier.dto';
import { TransferDocument } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { TransferPropertiesRelations } from '@transfer/transfer/entities/transfer.interface';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import EventsNamesCrmEnum from 'apps/crm-service/src/enum/events.names.crm.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesPersonEnum from 'apps/person-service/src/enum/events.names.person.enum';
import EventsNamesPspAccountEnum from 'apps/psp-service/src/enum/events.names.psp.acount.enum';
import EventsNamesPspEnum from 'apps/psp-service/src/enum/events.names.psp.enum';
import EventsNamesStatsEnum from 'apps/stats-service/src/enum/events.names.stats.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import axios from 'axios';
import { isArray, isMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { isObjectIdOrHexString } from 'mongoose';
import { ApproveOrRejectDepositDto } from '../../../libs/transfer/src/dto/approve.or.reject.deposit.dto';
import { TransferLeadStatsDto } from './dto/transfer.lead.stat.dto';
import EventsNamesTransferEnum from './enum/events.names.transfer.enum';

@Injectable()
export class TransferServiceService
  implements BasicMicroserviceService<TransferDocument>
{
  private eventClient: ClientProxy;

  constructor(
    @Inject(TransferServiceMongooseService)
    private lib: TransferServiceMongooseService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
  ) {
    this.eventClient = builder.getTransferEventClient();
  }
  findAll(
    query: QuerySearchAnyDto,
    context?: any,
  ): Promise<ResponsePaginator<TransferDocument>> {
    return this.getAll(query);
  }
  findOneById(id: string, context?: any): Promise<TransferDocument> {
    throw new Error('Method not implemented.');
  }
  createOne(createDto: CreateAnyDto, context?: any): Promise<TransferDocument> {
    throw new Error('Method not implemented.');
  }
  createMany(
    createDto: CreateAnyDto[],
    context?: any,
  ): Promise<TransferDocument[]> {
    throw new Error('Method not implemented.');
  }
  updateOne(updateDto: UpdateAnyDto, context?: any): Promise<TransferDocument> {
    throw new Error('Method not implemented.');
  }
  updateMany(
    updateDto: UpdateAnyDto[],
    context?: any,
  ): Promise<TransferDocument[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyById(
    ids: UpdateAnyDto[],
    context?: any,
  ): Promise<TransferDocument[]> {
    throw new Error('Method not implemented.');
  }
  deleteOneById(id: string, context?: any): Promise<TransferDocument> {
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

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getByLead(
    leadId: string,
  ): Promise<ResponsePaginator<TransferDocument>> {
    return this.getAll({
      // TODO[hender - 30/01/2024] Define max elements
      take: 10000000,
      where: {
        lead: leadId,
      },
    });
  }

  async getSearchText(
    query: QuerySearchAnyDto,
  ): Promise<ResponsePaginator<TransferDocument>> {
    query.relations = TransferPropertiesRelations;
    query.page = 1;
    return this.checkSearchText(query, this.lib);
  }

  private async checkSearchText(query, service) {
    let rta;
    do {
      const elems = await service.findAll(query);
      elems.list = elems.list.map((item) => {
        item.searchText = this.lib.getSearchText(item);
        this.builder.emitTransferEventClient(
          EventsNamesTransferEnum.updateOne,
          {
            id: item._id,
            searchText: item.searchText,
          },
        );
        Logger.debug(
          `${item.numericId} - ${item.leadEmail}`,
          `Updated searchText page ${elems.currentPage} / ${elems.lastPage}`,
        );
        return item;
      });
      query.page = elems.nextPage;
      if (!rta) {
        rta = elems;
      } else {
        rta.list = rta.list.concat(elems.list);
      }
    } while (query.page != 1);
    return rta;
  }

  async getAll(
    query: QuerySearchAnyDto,
  ): Promise<ResponsePaginator<TransferDocument>> {
    const statusId = await this.getStatusByName('Inactive');
    query.where = query.where ?? {};
    if (!query.where.status) {
      query.where.status = {
        $nin: [statusId._id.toString()],
      };
    }
    return this.lib.findAll(query);
  }

  async newTransfer(transfer: TransferCreateDto) {
    const data = await this.queryData(transfer);
    if (data.lead && data.pspAccount && data.typeTransaction) {
      transfer.leadCountry = data.lead.country;
      this.checkCountry(transfer, data);
      if (!data.crm) {
        data.crm = (await this.getCrmById(
          data.lead.crm.toString(),
        )) as any as CrmInterface;
      }
      await this.checkTransfer(transfer, data);
      if (transfer.isManualTx) {
        transfer.hasApproved = true;
        transfer.approvedAt = new Date();
        transfer.rejectedAt = null;
      }
      const transferSaved = await this.lib.create(transfer);
      if (transfer.hasApproved) {
        await this.sendTransferToCrm(transferSaved.lead, transferSaved);
      }
      await this.updateLead(data.lead, transferSaved);
      await this.checkStatsPspAndPspAccount(transferSaved);
      return transferSaved;
    }
    throw new BadRequestException(this.getMessageError(data));
  }

  async newDepositFromAffiliate(
    transfer: TransferCreateDto,
    affiliateId: string,
  ) {
    return this.newTransferFromAffiliate(
      transfer,
      affiliateId,
      OperationTransactionType.deposit,
    );
  }

  async newCreditFromAffiliate(
    transfer: TransferCreateDto,
    affiliateId: string,
  ) {
    return this.newTransferFromAffiliate(
      transfer,
      affiliateId,
      OperationTransactionType.credit,
    );
  }

  async newWithdrawalFromAffiliate(
    transfer: TransferCreateDto,
    affiliateId: string,
  ) {
    return this.newTransferFromAffiliate(
      transfer,
      affiliateId,
      OperationTransactionType.withdrawal,
    );
  }

  async newDebitFromAffiliate(
    transfer: TransferCreateDto,
    affiliateId: string,
  ) {
    return this.newTransferFromAffiliate(
      transfer,
      affiliateId,
      OperationTransactionType.debit,
    );
  }

  async newChargebackFromAffiliate(
    transfer: TransferCreateDto,
    affiliateId: string,
  ) {
    return this.newTransferFromAffiliate(
      transfer,
      affiliateId,
      OperationTransactionType.chargeback,
    );
  }

  async newTransferFromAffiliate(
    transfer: TransferCreateDto,
    affiliateId: string,
    operationType: OperationTransactionType,
  ) {
    let lead;
    if (!transfer.lead) {
      throw new BadRequestException('Need tpId or id of lead to pay');
    }
    transfer.operationType = operationType;
    if (isMongoId(transfer.lead)) {
      lead = await this.getLeadById(transfer.lead);
    } else {
      lead = await this.getLeadByTpId(transfer.lead);
    }
    if (!lead || lead?.affiliate?._id.toString() !== affiliateId) {
      if (await this.getAffiliateIsAdmin(affiliateId)) {
        throw new NotFoundException('Not found Lead');
      }
    }
    const affiliate: AffiliateDocument =
      await this.builder.getPromiseAffiliateEventClient(
        EventsNamesAffiliateEnum.findOneById,
        affiliateId,
      );
    transfer.userCreator = affiliate.user;
    if (transfer.hasApproved || transfer.isManualTx) {
      transfer.userApprover = affiliate.user;
    }
    transfer.lead = lead;
    const data = await this.queryData(transfer);
    //if (data.lead && data.pspAccount && data.typeTransaction) {
    if (data.lead && data.pspAccount) {
      transfer.pspAccount = data.pspAccount._id;
      transfer.name = transfer.name ?? 'Transaction of ' + lead.name;
      transfer.description =
        transfer.description ??
        'Transaction of ' +
          lead.name +
          ' ' +
          'On PSP ' +
          PspAccount.name +
          (data.typeTransaction
            ? ' ' + 'Of type ' + data.typeTransaction?.name
            : '');
      transfer.leadCountry = data.lead.country;
      transfer.country = transfer.country ?? transfer.leadCountry;
      this.checkCountry(transfer, data);
      if (!data.crm) {
        data.crm = (await this.getCrmById(
          data.lead.crm.toString(),
        )) as any as CrmInterface;
      }
      await this.checkTransfer(transfer, data);
      if (transfer.isManualTx) {
        transfer.hasApproved = true;
        transfer.approvedAt = new Date();
        transfer.rejectedAt = null;
      }
      const transferSaved = await this.lib.create(transfer);
      await this.updateLead(data.lead, transferSaved);
      await this.checkStatsPspAndPspAccount(transferSaved);
      const page = await this.getAll({
        where: {
          _id: transferSaved.id,
        },
        relations: [
          'psp',
          'status',
          'bank',
          'department',
          'typeTransaction',
          'pspAccount',
        ],
      });
      const transfer_ = page.list[0];
      if (transfer.hasApproved) {
        await this.sendTransferToCrm(transfer_.lead, transfer_);
      }
      return transfer_;
    }
    throw new BadRequestException(this.getMessageError(data));
  }

  async updateLead(
    lead: LeadInterface,
    transferSaved: TransferDocument,
    isNew = true,
  ) {
    // TODO[hender-2023-09-6] If the lead's country has a custom rule, take it, if not, take the general rule
    const ruleCftd = await this.getCategoryByName(
      'Money to CFTD from lead',
      TagEnum.RULE,
    );
    if (!lead.email) {
      const tmpLead = await this.getLeadById(lead._id);
      if (!tmpLead) {
        throw new BadRequestException(`Lead ${lead._id ?? lead} not found `);
      }
      lead = tmpLead as unknown as LeadInterface;
    }
    const quantityTransfer: number = lead.quantityTransfer + (isNew ? 1 : 0);
    const totalTransfer: number =
      lead.totalTransfer + (isNew ? transferSaved.amount : 0);
    const leadToUpdate: LeadUpdateDto = {
      id: lead._id,
      totalTransfer: totalTransfer,
      quantityTransfer: quantityTransfer,
      affiliate: lead.affiliate,
    };
    // TODO[hender - 07/02/2024] Check the hasApproved
    if (transferSaved.hasApproved) {
      if (!lead.partialFtdDate) {
        leadToUpdate.partialFtdDate =
          transferSaved.confirmedAt ?? transferSaved.approvedAt;
        leadToUpdate.partialFtdAmount = transferSaved.amount;
      }
      const totalPayed: number = lead.totalPayed + transferSaved.amount;
      leadToUpdate.totalPayed = totalPayed;
      if (!lead.dateCFTD) {
        if (totalPayed >= ruleCftd.valueNumber) {
          const statusNew: StatusInterface =
            await this.builder.getPromiseStatusEventClient(
              EventsNamesStatusEnum.findOneByName,
              //'G - New',
              'Active',
            );
          const statusCftd: StatusInterface =
            await this.builder.getPromiseStatusEventClient(
              EventsNamesStatusEnum.findOneByName,
              'CFTD',
            );
          leadToUpdate.statusCrm =
            isArray(lead.statusCrm) && lead.statusCrm.length
              ? lead.statusCrm
              : [lead.status ? lead.status?._id ?? lead.status : statusNew._id];
          leadToUpdate.dateCFTD = transferSaved.approvedAt;
          leadToUpdate.statusCrm.push(statusCftd);
        }
      }
      if (transferSaved.hasApproved && !transferSaved.crmTransactionResponse) {
        Logger.debug(
          'Saving on CRM',
          `Num ${transferSaved.numericId} - ${
            transferSaved.hasApproved ? 'Approved' : transferSaved.statusPayment
          }`,
        );
        await this.sendTransferToCrm(lead, transferSaved);
      } else {
        Logger.log(transferSaved, 'transfer was send');
      }
    }
    if (isNew) {
      leadToUpdate.transfers = lead.transfers ?? [];
      leadToUpdate.transfers.push(transferSaved._id.toString());
    }
    this.builder.emitLeadEventClient(
      EventsNamesLeadEnum.updateOne,
      leadToUpdate,
    );
  }

  async getAffiliateIsAdmin(affiliateId: string) {
    const affiliate: AffiliateDocument =
      await this.builder.getPromiseAffiliateEventClient(
        EventsNamesAffiliateEnum.findOneById,
        affiliateId,
      );
    if (!affiliate?._id) {
      throw new NotFoundException('Affiliate not found');
    }
    return affiliate.isAdmin ? undefined : affiliateId;
  }

  private async sendTransferToCrm(
    lead: LeadInterface | ObjectId,
    transferSaved: TransferDocument,
  ) {
    this.builder.emitCrmEventClient(EventsNamesCrmEnum.createOneTransferOnCrm, {
      lead: lead._id ?? lead,
      transfer: transferSaved._id,
    });
  }

  private async queryData(transfer: TransferCreateDto): Promise<{
    lead: LeadInterface;
    pspAccount: PspAccountInterface;
    typeTransaction: CategoryInterface;
    status: StatusInterface;
    department: CategoryInterface;
    bank: CategoryInterface;
    businessUnit: BusinessUnitInterface;
    crm: CrmInterface;
  }> {
    const promisesByIds = {
      lead: transfer.lead?._id
        ? transfer.lead
        : !!transfer.lead
        ? this.getLeadById(transfer.lead)
        : this.getLeadByTpId(transfer.lead),
      pspAccount: this.getPspAccountById(transfer.pspAccount),
      // TODO[hender] Buscar agregando el tipo de category
      typeTransaction:
        transfer.typeTransaction &&
        this.getCategoryById(transfer.typeTransaction),
      status: transfer.status && this.getStatusById(transfer.status),
      department:
        transfer.department && this.getCategoryById(transfer.department),
      bank: transfer.bank && this.getCategoryById(transfer.bank),
      businessUnit:
        transfer.businessUnit &&
        this.getBusinessUnitById(transfer.businessUnit),
      crm: transfer.crm && this.getCrmById(transfer.crm),
    };
    const data = {
      lead: null as LeadInterface,
      pspAccount: null as PspAccountInterface,
      typeTransaction: null as CategoryInterface,
      status: null as StatusInterface,
      department: null as CategoryInterface,
      bank: null as CategoryInterface,
      businessUnit: null as BusinessUnitInterface,
      crm: null as CrmInterface,
    };
    const keys = Object.keys(data);

    const valuesIds = await Promise.all(Object.values(promisesByIds));
    valuesIds.forEach((entry, idx) => {
      data[keys[idx]] = entry;
    });
    return data;
  }

  private async checkTransfer(transfer: TransferCreateDto, data) {
    transfer.leadCrmName = data.crm?.name;
    transfer.leadEmail = data.lead.email;
    transfer.leadTpId = data.lead.crmIdLead;
    transfer.leadAccountId = data.lead.crmAccountIdLead;
    transfer.psp = data.pspAccount?.psp;
    transfer.affiliate = data.lead.affiliate;
    // Fill status
    transfer.status = data.status?.name
      ? data.status
      : await this.checkStatus(transfer, data.status);
    // Fill department
    if (!data.department) {
      transfer.department = data.crm.department
        ? data.crm.department
        : await this.getCategoryDepartmentSales();
      transfer.department = transfer.department?._id || transfer.department;
    }
    // Fill bank
    transfer.bank = data.bank || data.pspAccount.bank;
    // Fill businessUnit
    transfer.businessUnit = data.lead.brand;
    // Fill crm
    transfer.crm = data.crm?.id || data.lead.crm;
    transfer.lead = data.lead?._id;
  }

  private async checkCountry(transfer: TransferCreateDto, data) {
    if (!transfer.leadCountry) {
      const person = await this.getPersonById(
        data.lead.personalData.toString(),
      );
      transfer.leadCountry = person.location?.country;
    }
  }

  private getMessageError(data): string {
    const keys = Object.keys(data);
    const message: string[] = [];
    const keysNeed = ['lead', 'pspAccount', 'typeTransaction'];
    keysNeed.forEach((key, idx) => {
      if (!data[key]) {
        message.push('Check ' + keys[idx] + ' data');
      }
    });
    return message.join(',');
  }

  private async checkStatus(
    transfer: TransferCreateDto,
    status: StatusInterface,
  ) {
    if (!status) {
      const _status = await this.getStatusSended();
      return _status?._id || _status;
    } else {
      const statusApproved = await this.getStatusApproved();
      if (transfer.status === statusApproved.id) {
        transfer.approvedAt = new Date();
      } else {
        const statusRejected = await this.getStatusRejected();
        if (transfer.status === statusRejected.id) {
          transfer.rejectedAt = new Date();
        }
      }
    }
    return transfer.status;
  }

  async newManyTransfer(createTransfersDto: TransferCreateDto[]) {
    return this.lib.createMany(createTransfersDto);
  }

  async updateTransfer(transfer: TransferUpdateDto) {
    return this.lib.update(transfer.id, transfer);
  }

  async updateTransferFromLatamCashier(
    transferLatamcashier: TransferUpdateFromLatamCashierDto,
  ) {
    if (!transferLatamcashier.transactionId) {
      // Check transfer to validate
      throw new BadRequestException('Need the transferId');
    }
    if (!transferLatamcashier.userId) {
      // Check lead to validate
      throw new BadRequestException('Need the userId');
    }
    let transfer: TransferDocument;
    if (isMongoId(transferLatamcashier.transactionId)) {
      // Check by ID
      transfer = await this.lib.findOne(transferLatamcashier.transactionId);
    } else {
      // Check by NumericId
      const transferNumeric = await this.lib.findAll({
        where: {
          numericId: transferLatamcashier.transactionId,
        },
      });
      if (transferNumeric.totalElements === 1) {
        // Validate transfer exist
        transfer = transferNumeric.list[0];
      }
    }
    if (!transfer?._id) {
      throw new BadRequestException('Transfer not found');
    }

    let lead;
    if (isMongoId(transferLatamcashier.userId)) {
      // Check by ID
      lead = await this.builder.getPromiseLeadEventClient(
        EventsNamesLeadEnum.findOneById,
        transferLatamcashier.userId,
      );
    } else {
      // Check by TpId
      lead = await this.builder.getPromiseLeadEventClient(
        EventsNamesLeadEnum.findOneByTpId,
        transferLatamcashier.userId,
      );
    }
    if (!lead._id) {
      // Validate lead exist
      throw new BadRequestException('UserId not found');
    }
    if (transfer.lead.toString() !== lead._id) {
      // Validate same lead
      throw new BadRequestException('TransferId does not correspond to UserId');
    }
    transfer.responsePayment = transferLatamcashier.pspInformation;
    transfer.statusPayment = transferLatamcashier.status;
    if (transfer.statusPayment === StatusCashierEnum.APPROVED) {
      const statusApproved = await this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'APPROVED',
      );
      transfer.status = statusApproved._id;
      transfer.hasApproved = true;
      transfer.approvedAt = new Date();
      transfer.confirmedAt = transfer.approvedAt;
    } else if (transfer.statusPayment === StatusCashierEnum.REJECTED) {
      const statusRejected = await this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'REJECTED',
      );
      transfer.status = statusRejected._id;
      transfer.hasApproved = false;
      transfer.rejectedAt = new Date();
    }
    const tx = await transfer.save();
    if (tx.hasApproved) {
      await this.sendTransferToCrm(transfer.lead, transfer);
    }
    return tx;
  }
  async updateTransferByIdPayment(
    updateTransferDto: any,
    query: QuerySearchAnyDto,
  ) {
    const transfers = await this.getAll(query);
    if (transfers.totalElements > 1 || !transfers?.list[0]) {
      throw new BadRequestException('Not found transfer');
    }
    const transfer = transfers.list[0];
    return this.lib.update(transfer.id, updateTransferDto);
  }

  async approveTransfer(transfer: ApproveOrRejectDepositDto) {
    transfer.approve = true;
    const transferDoc: TransferDocument = await this.lib.approveRejectTransfer(
      transfer,
    );
    await this.sendTransferToCrm(transferDoc.lead, transferDoc);
    await this.checkStatsPspAndPspAccount(transferDoc);
    await this.updateLead(
      transferDoc.lead as unknown as LeadInterface,
      transferDoc,
      false,
    );
    return transferDoc;
  }

  async sendToCrm(transfer: ApproveOrRejectDepositDto) {
    const transferDoc = await this.lib.findOne(transfer.id.toString());
    if (transferDoc?.hasApproved) {
      await this.sendTransferToCrm(transferDoc.lead, transferDoc);
      await this.checkStatsPspAndPspAccount(transferDoc);
      // TODO[hender - 15/feb/2024]: Update send tx to crm
      return transferDoc;
    }
    throw new BadRequestException('Not found transfer has not approved');
  }

  async rejectTransfer(transfer: ApproveOrRejectDepositDto) {
    transfer.approve = false;
    return this.lib.approveRejectTransfer(transfer);
  }

  async updateManyTransfer(transfers: TransferUpdateDto[]) {
    return this.lib.updateMany(
      transfers.map((transfer) => transfer.id.toString()),
      transfers,
    );
  }

  async deleteTransfer(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyTransfer(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async checkNumericId() {
    return this.lib.checkNumericId();
  }

  async checkTransferStatsByQuery(query: QuerySearchAnyDto) {
    return this.getStats(query);
  }

  private async checkStatsPspAndPspAccount(transfer: TransferDocument) {
    /* this.builder.emitTransferEventClient(
      EventsNamesTransferEnum.checkTransfersForPspAccountStats,
      transfer.pspAccount,
    ); */
    this.builder.emitStatsEventClient(
      EventsNamesStatsEnum.addNewTransferAllStats,
      transfer,
    );
  }

  private async getBusinessUnitById(
    id: string,
  ): Promise<BusinessUnitInterface> {
    return this.builder.getPromiseBusinessUnitEventClient(
      EventsNamesBusinessUnitEnum.findOneById,
      id,
    );
  }

  private async getBusinessUnitByName(
    name: string,
  ): Promise<BusinessUnitInterface> {
    return this.builder.getPromiseBusinessUnitEventClient(
      EventsNamesBusinessUnitEnum.findOneByName,
      name,
    );
  }

  private async getCrmById(id: string): Promise<CrmDocument> {
    return this.builder.getPromiseCrmEventClient(
      EventsNamesCrmEnum.findOneById,
      id,
    );
  }

  private async getCrmByName(name: string): Promise<CrmDocument> {
    return this.builder.getPromiseCrmEventClient(
      EventsNamesCrmEnum.findOneByName,
      name,
    );
  }

  private async getStatusSended(): Promise<StatusInterface> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      'Sended',
    );
  }

  private async getStatusApproved(): Promise<StatusInterface> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      StatusCashierEnum.APPROVED,
    );
  }

  private async getStatusRejected(): Promise<StatusInterface> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      StatusCashierEnum.REJECTED,
    );
  }

  private async getStatusPending(): Promise<StatusInterface> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      StatusCashierEnum.PENDING,
    );
  }

  private async getStatusById(id: string): Promise<StatusDocument> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneById,
      id,
    );
  }

  private async getStatusByName(id: string): Promise<StatusDocument> {
    return this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      id,
    );
  }

  private async getPersonById(id: string): Promise<PersonInterface> {
    return this.builder.getPromisePersonEventClient(
      EventsNamesPersonEnum.findOneById,
      id,
    );
  }

  private async getCategoryDepartmentSales(): Promise<CategoryInterface> {
    return this.getCategoryByName('Sales', TagEnum.DEPARTMENT);
  }

  private async getCategoryByName(
    categoryName: string,
    type = TagEnum.CATEGORY,
  ): Promise<CategoryInterface> {
    return this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: categoryName,
        type: type,
      },
    );
  }

  private async getCategoryById(id: string): Promise<CategoryInterface> {
    return this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneById,
      id,
    );
  }

  private async getPspAccountById(id: string): Promise<PspAccountDocument> {
    if (isMongoId(id)) {
      return this.builder.getPromisePspAccountEventClient(
        EventsNamesPspAccountEnum.findOneById,
        id,
      );
    }
    return this.builder.getPromisePspAccountEventClient(
      EventsNamesPspAccountEnum.findOneByCode,
      id,
    );
  }

  private async getPspAccountByName(id: string): Promise<PspAccountDocument> {
    return this.builder.getPromisePspAccountEventClient(
      EventsNamesPspAccountEnum.findOneByName,
      id,
    );
  }

  private async getPspById(id: string): Promise<PspInterface> {
    return this.builder.getPromisePspEventClient(
      EventsNamesPspEnum.findOneById,
      id,
    );
  }

  private async getLeadById(id: string): Promise<LeadDocument> {
    return this.builder.getPromiseLeadEventClient(
      EventsNamesLeadEnum.findOneById,
      id,
    );
  }

  private async getLeadByTpId(tpId: string): Promise<LeadDocument> {
    return this.builder.getPromiseLeadEventClient(
      EventsNamesLeadEnum.findOneByTpId,
      tpId,
    );
  }

  async getStats(query: QuerySearchAnyDto) {
    query = query ?? {};
    /* query.take = query.take ?? 10;
    if (!!query.start && !query.page) {
      query.page = Math.ceil(query.start / query.take);
    } else if (!!query.page && !query.start) {
      query.page = query.page - 1 > 0 ? query.page : 1;
      query.start = Math.max(0, query.page - 1) * query.take;
    } else {
      query.page = 1;
      query.start = 0;
    } */
    //const aggregate = this.model.aggregate();
    const aggregate = this.lib.model.aggregate();
    /* if (query.take) {
      aggregate.limit(query.take);
    }
    if (query.start) {
      aggregate.skip(query.start);
    } */
    if (query.where) {
      for (const key in query.where) {
        if (isMongoId(query.where[key])) {
          query.where[key] = new ObjectId(query.where[key]);
        }
      }
      aggregate.match(query.where);
    }
    query.order = query.order ?? [['createdAt', 'desc']];
    aggregate.sort(query.order);
    aggregate.lookup({
      from: 'leads',
      localField: 'lead',
      foreignField: '_id',
      as: 'lead_doc',
      pipeline: [
        {
          $project: {
            affiliate: '$affiliate',
            crm: '$crm',
            brand: '$brand',
            status: '$status',
            showToAffiliate: '$showToAffiliate',
            dateCreated: '$createdAt',
            dateCFtd: '$dateCFTD',
            dateFtd: '$dateFTD',
          },
        },
      ],
    });
    aggregate.addFields({
      leadInfo: {
        $first: '$lead_doc',
      },
    });
    aggregate.project({
      transfer: '$_id',
      amount: '$amount',
      currency: '$currency',
      operationType: '$operationType',
      sourceType: '$sourceType',
      lead: '$lead',
      affiliate: '$affiliate',
      status: '$status',
      department: '$department',
      typeTransaction: '$typeTransaction',
      psp: '$psp',
      pspAccount: '$pspAccount',
      crm: '$crm',
      brand: '$businessUnit',
      transferDateCreated: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$createdAt',
        },
      },
      transferDateApproved: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$approvedAt',
        },
      },
      leadStatus: '$leadInfo.status',
      leadSourceType: '$leadInfo.sourceType',
      leadShowToAffiliate: '$leadInfo.showToAffiliate',
      leadDateCreated: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$leadInfo.dateCreated',
        },
      },
      leadDateCftd: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$leadInfo.dateCFTD',
        },
      },
      leadDateFtd: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$leadInfo.dateFTD',
        },
      },
    });
    const list: Array<TransferLeadStatsDto> = await aggregate.exec();
    await this.checkStatsAffiliate(list);
    await this.checkStatsPspAccount(list);
  }

  async checkStatsAffiliate(transfersLeadStat: Array<TransferLeadStatsDto>) {
    const listStatsByLead = {};
    for (const transferLead of transfersLeadStat) {
      // Get list stats leads
      let statDate: StatsDateCreateDto =
        listStatsByLead[transferLead.lead.toString()];
      if (!statDate) {
        statDate = new StatsDateCreateDto();
        // LEADS STATS
        // Quantity Leads #
        statDate.quantityLeads++;
        if (transferLead.leadDateCftd) {
          // CFTD STATS
          // Quantity CFTD #
          statDate.quantityCftd++;
        } else if (transferLead.leadDateFtd) {
          // FTD STATS
          // Quantity FTD #
          statDate.quantityFtd++;
          if (transferLead.leadShowToAffiliate) {
            // Approved FTD STATS
            // Quantity ApprovedLeads #
            statDate.quantityApprovedLead++;
          }
        }
      }
      // LEADS STATS
      // Total $
      statDate.totalLeads += transferLead.amount;
      // Max $
      statDate.maxTotalLeads =
        transferLead.amount > (statDate.maxTotalLeads ?? 0)
          ? transferLead.amount
          : statDate.maxTotalLeads;
      // Min $
      statDate.minTotalLeads =
        transferLead.amount < (statDate.minTotalLeads ?? Infinity)
          ? transferLead.amount
          : statDate.minTotalLeads;
      // Average $
      statDate.averageTotalLeads = statDate.totalLeads / statDate.quantityLeads;
      if (transferLead.leadDateCftd) {
        // CFTD STATS
        // Total $
        statDate.totalCftd += transferLead.amount;
        // Max $
        statDate.maxTotalCftd =
          transferLead.amount > (statDate.maxTotalCftd ?? 0)
            ? transferLead.amount
            : statDate.maxTotalCftd;
        // Min $
        statDate.minTotalCftd =
          transferLead.amount < (statDate.minTotalCftd ?? Infinity)
            ? transferLead.amount
            : statDate.minTotalCftd;
        // Average $
        statDate.averageTotalCftd = statDate.totalCftd / statDate.quantityCftd;
      } else if (transferLead.leadDateFtd) {
        // FTD STATS
        // Total $
        statDate.totalFtd += transferLead.amount;
        // Max $
        statDate.maxTotalFtd =
          transferLead.amount > (statDate.maxTotalFtd ?? 0)
            ? transferLead.amount
            : statDate.maxTotalFtd;
        // Min $
        statDate.minTotalFtd =
          transferLead.amount < (statDate.minTotalFtd ?? Infinity)
            ? transferLead.amount
            : statDate.minTotalFtd;
        // Average $
        statDate.averageTotalFtd = statDate.totalFtd / statDate.quantityFtd;
        if (transferLead.leadShowToAffiliate) {
          // Approved FTD STATS
          // Total $
          statDate.totalApprovedLead += transferLead.amount;
          // Max $
          statDate.maxTotalApprovedLead =
            transferLead.amount > (statDate.maxTotalApprovedLead ?? 0)
              ? transferLead.amount
              : statDate.maxTotalApprovedLead;
          // Min $
          statDate.minTotalApprovedLead =
            transferLead.amount < (statDate.minTotalApprovedLead ?? Infinity)
              ? transferLead.amount
              : statDate.minTotalApprovedLead;
          // Average $
          statDate.averageTotalApprovedLead =
            statDate.totalApprovedLead / statDate.quantityApprovedLead;
        }
      }
      // TRANSFER STATS
      // Quantity #
      statDate.quantityTransfer++;
      // Total $
      statDate.totalTransfer += transferLead.amount;
      // Max $
      statDate.maxTotalTransfer =
        transferLead.amount > (statDate.maxTotalTransfer ?? 0)
          ? transferLead.amount
          : statDate.maxTotalTransfer;
      // Min $
      statDate.minTotalTransfer =
        transferLead.amount < (statDate.minTotalTransfer ?? Infinity)
          ? transferLead.amount
          : statDate.minTotalTransfer;
      // Average $
      statDate.averageTotalTransfer =
        statDate.totalTransfer / statDate.quantityTransfer;
      if (transferLead.transferDateApproved) {
        // APPROVED TRANSFER
        // Quantity #
        statDate.quantityApprovedTransfer++;
        // Total $
        statDate.totalApprovedTransfer += transferLead.amount;
        // Max $
        statDate.maxTotalApprovedTransfer =
          transferLead.amount > (statDate.maxTotalApprovedTransfer ?? 0)
            ? transferLead.amount
            : statDate.maxTotalApprovedTransfer;
        // Min $
        statDate.minTotalApprovedTransfer =
          transferLead.amount < (statDate.minTotalApprovedTransfer ?? Infinity)
            ? transferLead.amount
            : statDate.minTotalApprovedTransfer;
        // Average $
        statDate.averageTotalApprovedTransfer =
          statDate.totalApprovedTransfer / statDate.quantityApprovedTransfer;
      }
      statDate.sourceType = transferLead.sourceType;
      statDate.affiliate = transferLead.affiliate;
      statDate.brand = transferLead.brand;
      statDate.pspAccount = transferLead.pspAccount;
      statDate.psp = transferLead.psp;
      statDate.department = transferLead.department;
      statDate.operationType = transferLead.operationType;
      statDate.lead = transferLead.lead;
      statDate.transfer = transferLead.transfer;
      listStatsByLead[transferLead.lead.toString()] = statDate;
    }
    await this.builder.getPromiseStatsEventClient(
      EventsNamesStatsEnum.removeAllStatsAffiliate,
      {},
    );
    for (const lsbl of Object.values(listStatsByLead)) {
      this.builder.emitStatsEventClient(EventsNamesStatsEnum.createStat, lsbl);
    }
    return listStatsByLead;
  }

  async checkStatsPspAccount(transfersLeadStat: Array<TransferLeadStatsDto>) {
    const statDate = new StatsDateCreateDto();
    Logger.debug('checkStatsPspAccount', `${TransferServiceService.name}:902`);
  }

  async checkTransferInCashierSended() {
    return this.checkTransferInCashierByStatus('Sended');
  }

  async checkTransferInCashierPending() {
    return this.checkTransferInCashierByStatus('Pending', true);
  }

  async checkTransferInCashierByStatus(
    statusId?: string,
    checkedOnCashier = null,
  ) {
    let eventName = EventsNamesStatusEnum.findOneById;
    if (!statusId) {
      statusId = 'Sended';
    }
    if (!isObjectIdOrHexString(statusId)) {
      eventName = EventsNamesStatusEnum.findOneByName;
    }
    const status = await this.builder.getPromiseStatusEventClient(
      eventName,
      statusId,
    );
    if (!status._id) {
      throw new BadRequestException('Status not found');
    }
    const query = {
      take: 1000000,
      where: {
        status: status._id,
      } as any,
    };
    if (!!checkedOnCashier || checkedOnCashier === false) {
      query.where['checkedOnCashier'] = !!checkedOnCashier;
    }
    const transfers: ResponsePaginator<TransferDocument> = await this.findAll(
      query,
    );
    const baseUrl = 'https://psp-app.tech:4000/transactions/info/';
    const statusApproved = await this.getStatusApproved();
    const statusRejected = await this.getStatusRejected();
    const statusPending = await this.getStatusPending();
    const statuses = {};
    statuses[statusId.toUpperCase()] = status._id;
    statuses[StatusCashierEnum.APPROVED] = statusApproved._id;
    statuses[StatusCashierEnum.REJECTED] = statusRejected._id;
    statuses[StatusCashierEnum.PENDING] = statusPending._id;
    const today = new Date();
    for (const tx of transfers.list) {
      const createdAt = new Date(tx.createdAt);
      if (
        createdAt.getFullYear() < today.getFullYear() ||
        createdAt.getMonth() < today.getMonth()
      ) {
        // TODO[hender - 2024-05-14] Reject old tx (the last month)
        const txUpdateDto = {
          id: tx._id,
          status: statuses[StatusCashierEnum.REJECTED],
        } as TransferUpdateDto;
        this.builder.emitTransferEventClient(
          EventsNamesTransferEnum.updateOne,
          txUpdateDto,
        );
        continue;
      }
      const url = baseUrl + tx.numericId;
      try {
        const rta: LatamCashierPaymentResponse = (await axios.get(url))?.data;
        if (CommonService.getSlug(rta.payload.status) !== status.slug) {
          if (!statuses[rta.payload.status]) {
            const statusUpdate = await this.builder.getPromiseStatusEventClient(
              EventsNamesStatusEnum.findOneByName,
              rta.payload.status,
            );
            statuses[rta.payload.status] = statusUpdate._id;
          }
          const txUpdateDto = {
            id: tx._id,
            checkedOnCashier: false,
            statusPayment: rta.payload.status,
            status: statuses[rta.payload.status],
            responsePayment: rta,
          } as TransferUpdateDto;
          if (
            statuses[StatusCashierEnum.APPROVED] ===
            statuses[rta.payload.status]
          ) {
            txUpdateDto.approvedAt = new Date(
              rta.payload.notificationDate + 'Z',
            );
            txUpdateDto.confirmedAt = txUpdateDto.approvedAt;
            txUpdateDto.rejectedAt = null;
            txUpdateDto.hasApproved = true;
          } else if (
            statuses[StatusCashierEnum.REJECTED] ===
            statuses[rta.payload.status]
          ) {
            txUpdateDto.rejectedAt = new Date(
              rta.payload.notificationDate + 'Z',
            );
            txUpdateDto.confirmedAt = txUpdateDto.rejectedAt;
            txUpdateDto.approvedAt = null;
            txUpdateDto.hasApproved = false;
          } else {
            txUpdateDto.checkedOnCashier = true;
          }
          if (!txUpdateDto.checkedOnCashier) {
            if (tx.hasApproved) {
              // It was approved before and manually
              delete txUpdateDto.approvedAt;
              delete txUpdateDto.rejectedAt;
              delete txUpdateDto.hasApproved;
              await this.sendTransferToCrm(tx.lead, tx);
            }
            this.builder.emitTransferEventClient(
              EventsNamesTransferEnum.updateOne,
              txUpdateDto,
            );
            tx.approvedAt = tx.approvedAt ?? txUpdateDto.approvedAt;
            tx.rejectedAt = tx.rejectedAt ?? txUpdateDto.rejectedAt;
            tx.hasApproved = tx.hasApproved ?? txUpdateDto.hasApproved;
            tx.confirmedAt = txUpdateDto.confirmedAt;
            tx.checkedOnCashier = txUpdateDto.checkedOnCashier;
            await this.updateLead(
              tx.lead as unknown as LeadInterface,
              tx,
              false,
            );
            //await this.sendToCrm({ id: tx._id.toString() });
            Logger.debug(
              tx.id,
              `Send transfer to ${tx.leadCrmName} status ${rta.payload?.status}`,
            );
          }
          Logger.debug(
            tx.id,
            `Updated transfer ${url} status ${rta.payload?.status}`,
          );
        }
      } catch (err) {
        if (err.response?.data?.detail?.message === 'Transaction not found') {
          Logger.error(err, `Url ${url} - ${tx.statusPayment}`);
          this.builder.emitTransferEventClient(
            EventsNamesTransferEnum.updateOne,
            {
              id: tx._id,
              status: statuses[tx.statusPayment ?? StatusCashierEnum.PENDING],
              checkedOnCashier: false,
              responsePayment: err,
            },
          );
        } else {
          Logger.error(err, `Other error - Url ${url} - ${tx.statusPayment}`);
        }
        continue;
      }
    }
    return transfers;
  }
}
