import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BuildersService } from '@builder/builders';
import { CategoryDocument } from '@category/category/entities/mongoose/category.schema';
import { CommonService } from '@common/common';
import TagEnum from '@common/common/enums/TagEnum';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { CrmServiceMongooseService } from '@crm/crm';
import { CrmCreateDto } from '@crm/crm/dto/crm.create.dto';
import { CrmUpdateDto } from '@crm/crm/dto/crm.update.dto';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import { IntegrationService } from '@integration/integration';
import { GetUserDto } from '@integration/integration/crm/generic/dto/get-user.dto';
import { RegenerateUserAutoLoginUrlDto } from '@integration/integration/crm/generic/dto/regenerate-user-auto-login-url.dto';
import { IntegrationCrmService } from '@integration/integration/crm/generic/integration.crm.service';
import { AssignLeadLeverateRequestDto } from '@integration/integration/crm/leverate-integration/dto/assign.lead.leverate.request.dto';
import { CodeResponseLeverateEnum } from '@integration/integration/crm/leverate-integration/dto/result.response.leverate.dto';
import { LeadInterface } from '@lead/lead/entities/lead.interface';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import CheckStatsType from '@stats/stats/enum/check.stats.type';
import { StatusInterface } from '@status/status/entities/status.interface';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
import { isArray, isEmpty } from 'class-validator';
import { BadRequestError } from 'passport-headerapikey';
import { AutologinLeadFromAffiliateDto } from './dto/autologin.lead.from.affiliate.dto';
import { AutologinLeadFromAffiliateResponseDto } from './dto/autologin.lead.from.affiliate.response.dto';
import { CheckLeadStatusOnCrmDto } from './dto/check.lead.status.on.crm.dto';
import { CreateLeadOnCrmDto } from './dto/create.lead.on.crm.dto';
import { CreateTransferOnCrmDto } from './dto/create.transfer.on.crm.dto';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';

@Injectable()
export class CrmServiceService {
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(CrmServiceMongooseService)
    private lib: CrmServiceMongooseService,
    @Inject(IntegrationService)
    private readonly integrationService: IntegrationService,
    @Inject(SchedulerRegistry)
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    query = query || {};
    query.where = query.where || {};
    if (!query.where.status) {
      const activeStatus =
        await this.builder.getPromiseStatusEventClient<Status>(
          EventsNamesStatusEnum.findOneByName,
          'active',
        );
      if (!activeStatus) {
        throw new BadRequestError('Status active not found');
      }
      query.where.status = activeStatus._id;
    }
    return this.lib.findAll(query);
  }

  async getAllRetention(query: QuerySearchAnyDto) {
    return this.getAllByDepartment(query, 'Retention');
  }

  async getAllSales(query: QuerySearchAnyDto) {
    return this.getAllByDepartment(query, 'Sales');
  }

  async getAllByDepartment(query: QuerySearchAnyDto, departmentName: string) {
    query = query ?? {};
    query.where = query.where ?? {};
    const retentionCat = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: departmentName,
        type: TagEnum.DEPARTMENT,
      },
    );
    if (!retentionCat) {
      throw new BadRequestException('Department retention not found');
    }
    query.where.department = retentionCat._id;
    return this.getAll(query);
  }

  async newCrm(crm: CrmCreateDto) {
    const crmSaved = await this.lib.create(crm);
    this.builder.emitBusinessUnitEventClient(
      EventsNamesBusinessUnitEnum.updateOne,
      {
        id: crmSaved.businessUnit,
        currentCrm: crmSaved._id,
      },
    );
    return crmSaved;
  }

  async newManyCrm(createCrmsDto: CrmCreateDto[]) {
    return this.lib.createMany(createCrmsDto);
  }

  async updateCrm(crm: CrmUpdateDto) {
    return this.lib.update(crm.id.toString(), crm);
  }

  async updateManyCrms(crms: CrmUpdateDto[]) {
    return this.lib.updateMany(
      crms.map((crm) => crm.id.toString()),
      crms,
    );
  }

  async deleteCrm(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyCrms(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async createOneLeadOnCrm(data: CreateLeadOnCrmDto, moveLead = false) {
    const affiliate = await this.builder.getPromiseAffiliateEventClient(
      EventsNamesAffiliateEnum.findOneByPublicKey,
      data.secretKey,
    );
    if (!affiliate?._id) {
      throw new RpcException(`Affiliate "${data.secretKey}" isn't valid`);
    }
    data.leadDto.affiliateId = affiliate._id;
    data.leadDto.affiliateName = affiliate.name;
    data.leadDto.tradingPlatformId = affiliate.tradingPlatformId;
    data.leadDto.buOwnerId = affiliate.buOwnerId;
    const crm: CrmDocument = await this.getOne(data.leadDto.crm);
    if (!crm.url) {
      throw new RpcException("Can't save in CRM because i haven't the URL");
    }
    data.leadDto.crmDepartment = crm.department.toString();
    const category: CategoryDocument =
      await this.builder.getPromiseCategoryEventClient<CategoryDocument>(
        EventsNamesCategoryEnum.findOneById,
        crm.category,
      );
    if (!category?._id) {
      throw new RpcException("Category isn't valid");
    }
    let country = null;
    if (data.leadDto.country) {
      country = await this.builder.getPromiseCategoryEventClient(
        EventsNamesCategoryEnum.findOneByValueText,
        data.leadDto.country,
      );
    }
    if (!country) {
      throw new RpcException(
        `Can't save in CRM because i haven't the Country ${data.leadDto.country}`,
      );
    }
    const currency = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: country?.description,
      },
    );
    if (!currency) {
      throw new RpcException(
        "Can't save in CRM because i haven't the currency",
      );
    }
    data.leadDto.currencyIso = currency.valueText;
    //return this.taskSaveLeadInCrm(crmType, category, crm, data);
    try {
      const dto = this.integrationService.getCrmRegisterLeadDto(
        category.name,
        data.leadDto,
      );
      if (moveLead) {
        const crmOrigin: CrmDocument = await this.getOne(affiliate.crm);
        const crmIntegration = await this.getCrmType(
          crmOrigin,
          category,
          affiliate,
        );
        //Logger.debug(category, `${CrmServiceService.name}:199`);
        if (
          category.slug === 'leverate' ||
          CommonService.getSlug(category.name) === 'leverate'
        ) {
          const lead: LeadInterface =
            await this.builder.getPromiseLeadEventClient(
              EventsNamesLeadEnum.findOneById,
              data.leadDto._id,
            );
          const statusNew: StatusInterface =
            await this.builder.getPromiseStatusEventClient(
              EventsNamesStatusEnum.findOneByName,
              'G - New',
            );
          if (!statusNew) {
            throw new NotFoundException('Not found status new');
          }
          await this.checkLeadDetails(crmIntegration, lead);
          const assignDto: AssignLeadLeverateRequestDto =
            new AssignLeadLeverateRequestDto(lead);
          assignDto.userId = crm.buOwnerIdCrm;
          assignDto.leadStatus = {
            name: statusNew.name,
            value: statusNew.description,
          };
          const leadRta: any = await crmIntegration.affiliateAssignLead(
            assignDto,
          );
          const msg = `CRM ${crmOrigin.name} reassigned error`;
          //if (leadRta.code === 400 && !leadRta.message.length) {
          if (leadRta.code === CodeResponseLeverateEnum.Success) {
            Logger.debug(leadRta, `Account reassigned to new owner`);
            await this.builder.getPromiseLeadEventClient(
              EventsNamesLeadEnum.updateOne,
              {
                id: lead._id,
                hasMoved: true,
                dateRetention: new Date(),
              },
            );
            return this.builder.getPromiseLeadEventClient(
              EventsNamesLeadEnum.findOneById,
              data.leadDto._id,
            );
          } else {
            Logger.error(leadRta, msg);
            await this.builder.getPromiseLeadEventClient(
              EventsNamesLeadEnum.deleteOneById,
              lead._id,
            );
          }
          throw new BadRequestException(msg);
        }
      } else {
        const crmIntegration: IntegrationCrmService =
          await this.integrationService.getCrmIntegration(
            crm,
            category.name,
            crm.url,
            affiliate.crmUsernameAffiliate,
            affiliate.crmPasswordAffiliate,
            affiliate.crmApiKeyAffiliate,
            affiliate.crmTokenAffiliate,
          );
        const leadRta = await crmIntegration.affiliateRegisterLead(dto);
        // TODO[hender - 2023/09/12] It works only for Leverate since it does not standardize the response
        if (leadRta?.accountId) {
          Logger.debug(leadRta, 'Registered lead');
          return this.builder.getPromiseLeadEventClient(
            EventsNamesLeadEnum.updateOne,
            {
              id: data.leadDto._id,
              //crmIdLead: leadRta.id,
              //crmAccountIdLead: leadRta.tpAccountName,
              crmIdLead: leadRta.tpAccountName,
              crmAccountIdLead: leadRta.accountId,
              crmAccountPasswordLead: leadRta.tpAccountPassword,
            },
          );
        } else {
          Logger.debug(data.leadDto, `CRM ${crm.name} register lead error`);
          await this.builder.getPromiseLeadEventClient(
            EventsNamesLeadEnum.deleteOneById,
            data.leadDto._id,
          );
        }
      }
    } catch (err) {
      Logger.error(JSON.stringify(err), 'Error createOneLeadOnCrm');
      await this.builder.getPromiseLeadEventClient(
        EventsNamesLeadEnum.deleteOneById,
        data.leadDto._id,
      );
      if (err.message.toLowerCase().indexOf('already exists') > 0) {
        Logger.error(
          data.leadDto._id,
          `CRM ${crm.name} already exists lead - deleted`,
        );
      }
      //throw err;
      throw new BadRequestException('Already exists');
    }
    return null;
  }

  async taskSaveLeadInCrm(
    crmType: IntegrationCrmService,
    category: CategoryDocument,
    crm: CrmDocument,
    data: CreateLeadOnCrmDto,
  ) {
    const taskName =
      crm.name +
      '_' +
      data.secretKey +
      '_' +
      data.leadDto.email +
      new Date().getTime().toString();
    let task;
    try {
      task = this.schedulerRegistry.getTimeout(taskName);
    } catch (err) {
      Logger.error(err, 'Save lead schedulerRegistry');
    }
    return new Promise((resolve) => {
      if (task) {
        clearTimeout(task);
      }
      CommonService.addTimeout(
        this.schedulerRegistry,
        taskName,
        1500,
        async () => {
          const leadRta = await crmType.affiliateRegisterLead(
            this.integrationService.getCrmRegisterLeadDto(
              category.name,
              data.leadDto,
            ),
          );
          if (!!leadRta?.id) {
            resolve(
              this.builder.getPromiseLeadEventClient(
                EventsNamesLeadEnum.updateOne,
                {
                  id: data.leadDto._id,
                  crmIdLead: leadRta.id,
                  crmAccountIdLead: leadRta.accountId,
                  crmAccountPasswordLead: leadRta.accountPassword,
                },
              ),
            );
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  async autologinLeadOnCrm(data: AutologinLeadFromAffiliateDto) {
    const crmIntegration: IntegrationCrmService = await this.getCrmIntegration(
      data.affiliateId,
      false,
    );
    delete data.affiliateId;
    const rta: AutologinLeadFromAffiliateResponseDto =
      await crmIntegration.affiliateRegenerateUserAutoLoginUrl(
        data as unknown as RegenerateUserAutoLoginUrlDto,
      );
    return rta.url;
  }

  async createOneTransferOnCrm(data: CreateTransferOnCrmDto) {
    const lead = data.lead.affiliate
      ? data.lead
      : await this.builder.getPromiseLeadEventClient<LeadInterface>(
          EventsNamesLeadEnum.findOneById,
          data.lead,
        );
    const crmType: IntegrationCrmService = await this.getCrmTypeFromLead(
      lead.affiliate,
    );
    let transferRta;
    data.transfer = data.transfer.operationType
      ? data.transfer
      : await this.builder.getPromiseTransferEventClient(
          EventsNamesTransferEnum.findOneByIdToCrmSend,
          data.transfer._id ?? data.transfer,
        );
    await this.checkLeadDetails(crmType, lead);
    data.transfer.leadName = lead.name;
    data.transfer.leadTradingPlatformId = lead.crmTradingPlatformAccountId;
    Logger.debug(
      JSON.stringify(data.transfer),
      'CrmServiceService:createOneTransferOnCrm: data.transfer',
    );
    if (data.transfer.operationType === OperationTransactionType.deposit) {
      //TODO[hender - 2024/02/19] Save response of crm (success or error)
      transferRta = await crmType.crmRegisterPayment(data.transfer);
    } else if (
      data.transfer.operationType === OperationTransactionType.withdrawal
    ) {
      transferRta = await crmType.crmCreateWithdrawal(data.transfer);
    } else if (
      data.transfer.operationType === OperationTransactionType.credit
    ) {
      transferRta = await crmType.crmCreateCredit(data.transfer);
    } else {
      // TODO[hender] Dynamic define OperationTypes
      if (!data.transfer.operationType) {
        throw new BadGatewayException(
          `Transaction ${data.transfer.operationType} unsupported in CRM`,
        );
      }
    }
    data.transfer = await this.builder.getPromiseTransferEventClient(
      EventsNamesTransferEnum.updateOne,
      {
        id: data.transfer?._id,
        crmTransactionId: transferRta.transactionId?.toString() ?? '---',
        crmTransactionResponse: {
          date: new Date(),
          ...transferRta,
        },
      } as unknown as TransferInterface,
    );
    return data.transfer;
  }

  async getCrmTypeFromLead(affiliateId) {
    const affiliate = await this.builder.getPromiseAffiliateEventClient(
      EventsNamesAffiliateEnum.findOneById,
      affiliateId,
    );
    if (!affiliate._id) {
      throw new BadRequestError(`Affiliate "${affiliateId}" isn't valid`);
    }
    const crm: CrmDocument = await this.getOne(affiliate.crm);
    if (!crm.url) {
      throw new BadRequestError("Can't save in CRM because i haven't the URL");
    }
    const category = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneById,
      crm.category,
    );
    return await this.getCrmType(crm, category, affiliate);
  }

  async getCrmType(
    crm: CrmDocument,
    category: CategoryDocument,
    affiliate: AffiliateDocument,
  ) {
    return this.integrationService.getCrmIntegration(
      crm,
      category.name,
      crm.url,
      affiliate.crmUsernameAffiliate,
      affiliate.crmPasswordAffiliate,
      affiliate.crmApiKeyAffiliate,
      affiliate.crmTokenAffiliate,
    );
  }

  async checkLeadDetails(crmType: IntegrationCrmService, lead: LeadInterface) {
    if (!lead.crmTradingPlatformAccountId) {
      const accountDetails = await crmType.crmLeadAccountDetails(
        lead.crmIdLead,
      );
      const tpAccountInfo = accountDetails['tpAccountInfo'];
      if (
        isEmpty(tpAccountInfo) ||
        !isArray(tpAccountInfo) ||
        !tpAccountInfo[0].lv_tpaccountid
      ) {
        Logger.error(JSON.stringify(tpAccountInfo), CrmServiceService.name);
        throw new BadRequestException(
          `Can't get the account trading platform id`,
        );
      }
      await this.builder.getPromiseLeadEventClient(
        EventsNamesLeadEnum.updateOne,
        {
          id: lead._id,
          crmTradingPlatformAccountId: tpAccountInfo[0].lv_tpaccountid,
        },
      );
      lead.crmTradingPlatformAccountId = tpAccountInfo[0].lv_tpaccountid;
    }
    return lead;
  }

  async getCrmIntegration(key: string, isSecretKeyAffiliate = true) {
    let affiliate;
    if (isSecretKeyAffiliate) {
      affiliate = await this.builder.getPromiseAffiliateEventClient(
        EventsNamesAffiliateEnum.findOneByPublicKey,
        key,
      );
    } else {
      affiliate = await this.builder.getPromiseAffiliateEventClient(
        EventsNamesAffiliateEnum.findOneById,
        key,
      );
    }
    if (!affiliate?._id) {
      throw new RpcException(`Affiliate "${key}" isn't valid`);
    }
    const crm: CrmDocument = await this.getOne(affiliate.crm);
    if (!crm.url) {
      throw new RpcException("Can't save in CRM because i haven't the URL");
    }
    const category: CategoryDocument =
      await this.builder.getPromiseCategoryEventClient<CategoryDocument>(
        EventsNamesCategoryEnum.findOneById,
        //crm.department,
        crm.category,
      );
    if (!category?._id) {
      throw new RpcException("Category isn't valid");
    }
    return this.integrationService.getCrmIntegration(
      crm,
      category.name,
      crm.url,
      affiliate.crmUsernameAffiliate,
      affiliate.crmPasswordAffiliate,
      affiliate.crmApiKeyAffiliate,
      affiliate.crmTokenAffiliate,
    );
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
    const crms: ResponsePaginator<CrmDocument> = await this.getAll({
      page,
    });
    for (const crm of crms.list) {
      this.builder.emitLeadEventClient(
        EventsNamesLeadEnum.checkLeadsForCrmStats,
        crm.id,
      );
    }
    if (crms.currentPage !== crms.lastPage) {
      this.checkStatsLead(configCheckStats, crms.nextPage);
    }
  }

  async checkStatsTransfer(configCheckStats: ConfigCheckStatsDto) {
    Logger.log(configCheckStats, 'CHECK STATS CRMS TRANSFER');
  }

  async checkCrmLeadStatus(data: CheckLeadStatusOnCrmDto) {
    let base = 'WHERE';
    if (!!data.affiliatesToCheck) {
      const modifyOnMin = '%5BmodifiedOn%5D%5Bmin%5D=';
      data.start = new Date(data.start);
      // TODO[hender - 24/ene/2024] Make param the minutes before
      data.start.setUTCHours(
        data.start.getUTCHours(),
        data.start.getUTCMinutes() - 15,
      );
      const modifyOnMax = '%5BmodifiedOn%5D%5Bmax%5D=';
      if (data.start) {
        base +=
          modifyOnMin +
          `${data.start.getUTCFullYear()}/${CommonService.getNumberDigits(
            data.start.getUTCMonth() + 1,
          )}/${data.start.getUTCDate()}T${CommonService.getNumberDigits(
            data.start.getUTCHours(),
          )}:${CommonService.getNumberDigits(data.start.getUTCMinutes())}:00`;
      }
      if (data.end) {
        /*data.end = new Date(data.end);
        if (data.start) {
          base += '&';
        }
        base +=
          modifyOnMax +
          `${data.end.getUTCFullYear()}/${
            data.end.getUTCMonth() + 1
          }/${data.end.getUTCDate()}T11%3A59%3A59`;*/
      }
      const result = {
        total: 0,
        error: {
          count: 0,
          leads: [],
        },
        sameStatus: {
          count: 0,
          leads: [],
        },
        affico360: {
          count: 0,
          leads: [],
        },
        moises: {
          count: 0,
          leads: [],
        },
      };
      const statusesFinded = {};
      //const promises = [];
      for (const affiliateId of data.affiliatesToCheck) {
        //Logger.debug(affiliateId, 'affiliate check affiliate');
        const crmType: IntegrationCrmService = await this.getCrmTypeFromLead(
          affiliateId,
        );
        try {
          const leadsRta = await crmType.affiliateGetUsers(`?${base}`);
          const leads = (leadsRta?.data as Array<GetUserDto>) ?? [];
          result.total += leads.length;
          //Logger.debug(leads.length, `Leads to check status in CRM`);
          if (leads.length) {
            const leadsAffico: ResponsePaginator<Lead> =
              await this.builder.getPromiseLeadEventClient(
                EventsNamesLeadEnum.findAll,
                {
                  take: 1000,
                  searchText: leads
                    .map((lead) => `crmIdLead:${lead.tpAccount}`)
                    .join('|'),
                },
              );
            result.moises.count = leads.length - leadsAffico.totalElements;
            for (const leadAffico of leadsAffico.list) {
              const leadCrm = leads.filter((lead) => {
                return lead.tpAccount === leadAffico.crmIdLead;
              })[0];
              if (!statusesFinded[leadCrm.leadStatusCode]) {
                statusesFinded[leadCrm.leadStatusCode] =
                  await this.builder.getPromiseStatusEventClient(
                    EventsNamesStatusEnum.findOneByDescription,
                    leadCrm.leadStatusCode,
                  );
              }
              if (statusesFinded[leadCrm.leadStatusCode]?._id) {
                if (
                  statusesFinded[leadCrm.leadStatusCode]._id !=
                  leadAffico.status._id
                ) {
                  result.affico360.count++;
                  result.affico360.leads.push(leadCrm.tpAccount);
                  this.builder.emitLeadEventClient(
                    EventsNamesLeadEnum.updateOne,
                    {
                      id: leadAffico._id,
                      status: statusesFinded[leadCrm.leadStatusCode]._id,
                    },
                  );
                } else {
                  result.sameStatus.count++;
                  result.sameStatus.leads.push(leadCrm.tpAccount);
                }
              } else {
                result.error.count++;
                result.error.leads.push(leadCrm.tpAccount);
                Logger.error(
                  `Status ${leadCrm.leadStatus} not found for ${leadCrm.tpAccount}`,
                  'No update lead',
                );
              }
            }
          }
          Logger.log(
            `${
              crmType.crm.name
            } - ${affiliateId} start ${data.start.toUTCString()} - ${base}`,
            `Result status update ${result.total} crm leads`,
          );
        } catch (error) {
          Logger.error(
            { error, where: base },
            `Error get lead statuses from CRM ${crmType.crm.name} - ${affiliateId}`,
          );
        }
      }
      /* Logger.debug(
        `Updated ${result.affico360.count}. No updated ${result.moises.count}. Same status ${result.sameStatus.count}. Errors ${result.error.count}`,
        `Result status update ${result.total} crm leads ${}`,
      ); */
      if (result.error.count) {
        Logger.debug(result.error.leads, 'Lead tpIds with error');
      }
    } else if (!!data.leadsToCheck) {
      const crmTypes = {};
      const groupLeadsByAffiliate = {};
      base += '%5Bemail%5D%5B%5D=';
      for (const leadId of data.leadsToCheck) {
        const lead =
          await this.builder.getPromiseLeadEventClient<LeadInterface>(
            EventsNamesLeadEnum.findOneById,
            leadId,
          );
        const affiliateId = lead.affiliate.toString();
        if (lead._id) {
          if (!crmTypes[affiliateId]) {
            crmTypes[affiliateId] = await this.getCrmTypeFromLead(affiliateId);
          }
          crmTypes[affiliateId] =
            crmTypes[affiliateId] ??
            (await this.getCrmTypeFromLead(affiliateId));
        }
        groupLeadsByAffiliate[affiliateId] =
          groupLeadsByAffiliate[affiliateId] ?? [];
        groupLeadsByAffiliate[affiliateId].push(lead);
      }
      for (const affiliateId in groupLeadsByAffiliate) {
        const crmType: IntegrationCrmService = await this.getCrmTypeFromLead(
          affiliateId,
        );
        const WHERE: Array<string> = groupLeadsByAffiliate[affiliateId].map(
          (lead) => `${base + lead.email}`,
        );
        try {
          const leadsRta = await crmType.affiliateGetUsers(
            `?${WHERE.join('&')}`,
          );
          const leads = (leadsRta?.data as Array<GetUserDto>) ?? [];
          for (const leadCrm of leads) {
            const statusList = await this.builder.getPromiseStatusEventClient(
              EventsNamesStatusEnum.findAll,
              {
                where: {
                  description: leadCrm.leadStatusCode,
                },
              },
            );
            if (statusList.list.length === 1) {
              this.builder.emitLeadEventClient(
                EventsNamesLeadEnum.updateOneByTpId,
                {
                  crmIdLead: leadCrm.tpAccount,
                  status: statusList.list[0]._id,
                },
              );
            } else {
              Logger.debug(
                `Status ${leadCrm.leadStatus} not found for ${leadCrm.tpAccount}`,
                'No update lead',
              );
            }
          }
        } catch (error) {
          Logger.error(error);
          continue;
        }
      }
    }
  }
}
/**
 * 05/28/2024, 6:33:22 PM
{
  "headers": {
    "Accept": "*\/*",
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3MTY5Mzg2OTAsImV4cCI6MTcxNzAyMTQ5MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJhZmZpbGlhdGVhcGkiXSwiY2xpZW50X2lkIjoiYWZmaWxpYXRlYXBpLmNsaWVudCIsInN1YiI6ImQxMWQ1NGE5LWIwMWEtNGJmNy1iNTYyLTlmOWVjMGZmM2VhNiIsImF1dGhfdGltZSI6MTcxNjkzODY5MCwiaWRwIjoibG9jYWwiLCJuYW1lIjoibGF0YW1ncm91cF9meGludGVncmFsIiwibWV0aG9kcyI6WyJHZXRBY2NvdW50cyIsIlJlZ2lzdHJhdGlvbldpdGhTU08iLCJDcmVhdGVSZWFsV2l0aFRva2VuIiwiQ3JlYXRlUmVhbCIsIkNyZWF0ZUxlYWQiLCJHZXRGdGRUcmFuc2FjdGlvbnMiXSwiYWxsb3dlZGlwIjoiMTQ4LjI0NC4xMjYuMjE4LDE3Mi4yMC41OC40MywzLjE4LjEyNC4xNywyMDEuMTQxLjIxOC4xMzUsMTgxLjIwNS4xNTAuNjAsNTAuMTguMTA4Ljg0LDEzLjU2LjMxLjE3NiwxODUuMTI3LjE4LjkwLDUwLjE4LjEwOC44NCwxODEuMjA1LjE0My4yMTMsNTAuMTguNzMuMTE3LDUwLjE4LjEwOC44NCIsImFsbG93ZWRpcHJhbmdlIjoiMS4xLjEuMS0yNTUuMjU1LjI1NS4yNTUiLCJvcmdhbml6YXRpb24iOiJMYXRhbUdyb3VwIiwiYWZmaWxpYXRlIjoibGF0YW1ncm91cF9meGludGVncmFsIiwic2NvcGUiOlsiYWZmaWxpYXRlYXBpIl0sImFtciI6WyJwd2QiXX0.aTBJbFPlN-z8Ly4ntHo_eyO8BPYg7iNSYRyywTfXIU2M-Elkw1k_CibjEZ9lBLPSckt_y9iYouCHdSzh1ir5bQ",
    "Api-Version": 4
  },
  "data": {
    "firstName": "test",
    "lastName": "test",
    "isoCurrency": "USD",
    "tradingPlatformId": "AFA11071-E8E4-ED11-B4F9-005056B1159A",
    "buOwnerId": "22B33F5C-F0E4-ED11-B4F6-005056B1CC58",
    "email": "test77000@gmail.com",
    "phone": "+56996738334",
    "isoCountry": "CL",
    "campaignId": "null - Auto Trading Software | https://www.home.saxo/en",
    "subAffiliate": "655ccd16dc86e131d2a92e78",
    "tag": "Auto Trading Software | https://www.home.saxo/en",
    "additionalInfo2": "https://nodomain.com",
    "additionalInfo3": "Stive - FxIntegral ANG"
  }
}; 
*/
