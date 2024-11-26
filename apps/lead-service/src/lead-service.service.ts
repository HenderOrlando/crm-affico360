import { CreateLeadAffiliateDto } from '@affiliate/affiliate/domain/dto/create-lead-affiliate.dto';
import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BuildersService } from '@builder/builders';
import { BusinessUnitDocument } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { CommonService } from '@common/common';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { BasicMicroserviceService } from '@common/common/models/basic.microservices.service';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { LeadServiceMongooseService } from '@lead/lead';
import { LeadCreateDto } from '@lead/lead/dto/lead.create.dto';
import { LeadUpdateDto } from '@lead/lead/dto/lead.update.dto';
import { TransactionLeadCreateDto } from '@lead/lead/dto/transaction-lead.create.dto';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { LeadPspServiceMongooseService } from '@lead/lead/lead-psp-service-mongoose.service';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, Ctx, RmqContext } from '@nestjs/microservices';
import { PersonInterface } from '@person/person/entities/PersonInterface';
import { PersonDocument } from '@person/person/entities/mongoose/person.schema';
import { StatsDateAffiliateDocument } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { UserRegisterDto } from '@user/user/dto/user.register.dto';
import { UserDocument } from '@user/user/entities/mongoose/user.schema';
import { AffiliateServiceService } from 'apps/affiliate-service/src/affiliate-service.service';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import { BusinessUnitServiceService } from 'apps/business-unit-service/src/business-unit-service.service';
import { CategoryServiceService } from 'apps/category-service/src/category-service.service';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import { AutologinLeadFromAffiliateDto } from 'apps/crm-service/src/dto/autologin.lead.from.affiliate.dto';
import { CheckLeadStatusOnCrmDto } from 'apps/crm-service/src/dto/check.lead.status.on.crm.dto';
import EventsNamesCrmEnum from 'apps/crm-service/src/enum/events.names.crm.enum';
import EventsNamesMessageEnum from 'apps/message-service/src/enum/events.names.message.enum';
import { PersonServiceService } from 'apps/person-service/src/person-service.service';
import { RoleServiceService } from 'apps/role-service/src/role-service.service';
import EventsNamesStatsEnum from 'apps/stats-service/src/enum/events.names.stats.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import { StatusServiceService } from 'apps/status-service/src/status-service.service';
import { UserServiceService } from 'apps/user-service/src/user-service.service';
import { isArray, isEmpty, isString } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import EventsNamesTransferEnum from '../../transfer-service/src/enum/events.names.transfer.enum';
import { AutologinLeadDto } from './dto/autologin.lead.dto';
import { AutologinLeadResponse } from './dto/autologin.lead.response';
import { CftdToFtdDto } from './dto/cftd_to_ftd.dto';
import { LeadResponseDto } from './dto/lead.response.dto';
import { StatsLeadResponseDto } from './dto/lead.stats.response.dto';
import { LoginLeadDto } from './dto/login.lead.dto';
import { MoveLeadDto } from './dto/move_lead.dto';
import EventsNamesLeadEnum from './enum/events.names.lead.enum';

@Injectable()
export class LeadServiceService
  implements BasicMicroserviceService<LeadDocument>
{
  private eventClient: ClientProxy;
  private statusCftd: StatusDocument;
  private statusFtd: StatusDocument;

  constructor(
    private configService: ConfigService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(LeadServiceMongooseService)
    private lib: LeadServiceMongooseService,
    @Inject(LeadPspServiceMongooseService)
    private libPsp: LeadPspServiceMongooseService,
    @Inject(BusinessUnitServiceService)
    private readonly businessUnitService: BusinessUnitServiceService,
    @Inject(AffiliateServiceService)
    private readonly affiliateService: AffiliateServiceService,
    @Inject(CategoryServiceService)
    private readonly categoryService: CategoryServiceService,
    @Inject(StatusServiceService)
    private readonly statusService: StatusServiceService,
    @Inject(PersonServiceService)
    private readonly personService: PersonServiceService,
    @Inject(UserServiceService)
    private readonly userService: UserServiceService,
    @Inject(RoleServiceService)
    private readonly roleService: RoleServiceService,
  ) {
    this.eventClient = builder.getEventClient();
  }
  findAll(
    query: QuerySearchAnyDto,
    context?: any,
  ): Promise<ResponsePaginator<LeadDocument>> {
    return this.getAll(query);
  }
  findOneById(id: string, context?: any): Promise<LeadDocument> {
    throw new Error('Method not implemented.');
  }
  createOne(createDto: CreateAnyDto, context?: any): Promise<LeadDocument> {
    throw new Error('Method not implemented.');
  }
  createMany(
    createDto: CreateAnyDto[],
    context?: any,
  ): Promise<LeadDocument[]> {
    throw new Error('Method not implemented.');
  }
  updateOne(updateDto: UpdateAnyDto, context?: any): Promise<LeadDocument> {
    throw new Error('Method not implemented.');
  }
  updateMany(
    updateDto: UpdateAnyDto[],
    context?: any,
  ): Promise<LeadDocument[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyById(ids: UpdateAnyDto[], context?: any): Promise<LeadDocument[]> {
    throw new Error('Method not implemented.');
  }
  deleteOneById(id: string, context?: any): Promise<LeadDocument> {
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

  async loginLead(loginData: LoginLeadDto): Promise<LeadDocument> {
    const affiliate = await this.validateAffiliateSecretKey(
      loginData.apiKey,
      null,
    );
    if (!affiliate) {
      throw new BadRequestException('Invalid access');
    }
    if (!loginData.password) {
      throw new BadRequestException('Need a password');
    }
    if (!loginData.username) {
      throw new BadRequestException('Need a email or tpId as username');
    }
    const search = await Promise.all([
      this.getOneByTpId(loginData.username, true),
      this.getOneByEmail(loginData.username, true),
    ]);
    const lead = search[0] || search[1];
    if (!!lead) {
      if (lead.affiliate.toString() === affiliate.id) {
        return lead.crmAccountPasswordLead === loginData.password ||
          lead.password === loginData.password
          ? lead
          : null;
      }
    }
    return null;
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getOneByEmail(
    email: string,
    relations = false,
    affiliateId = null,
  ): Promise<LeadDocument> {
    const where = {
      order: [['createdAt', 1]],
      where: {
        email: email,
      },
      relations: ['status', 'statusCrm', 'referralType'],
    } as QuerySearchAnyDto;
    if (!relations) {
      delete where.relations;
    }
    const leads = await this.lib.findAll(where);
    if (affiliateId) {
      leads.list = leads.list.filter(
        (lead) => lead.affiliate.id === affiliateId,
      );
    }
    return leads.list[0];
  }

  async getOneByTpId(tpId: string, relations: boolean | Array<string> = false) {
    const where = {
      where: {
        crmIdLead: tpId,
      },
      relations: isArray(relations)
        ? relations
        : ['status', 'statusCrm', 'referralType'],
    } as QuerySearchAnyDto;
    if (!relations) {
      delete where.relations;
    }
    const leads = await this.lib.findAll(where);
    return leads.list[0];
  }

  async getAll(query: QuerySearchAnyDto) {
    if (!query.where?.crmDepartment) {
      //TODO[hender - 2024/02/24] Default filter for sales
      const salesDpto = await this.getDptoSales();
      query.where = query.where || {};
      query.where.crmDepartment = salesDpto._id;
    }
    if (query?.where?.start && query?.where?.end) {
      query.where.$or = [];
      const dateRage = {
        start: query.where.start,
        end: query.where.end,
      };
      query.where.$or.push({
        dateCFTD: dateRage,
      });
      query.where.$or.push({
        dateFTD: dateRage,
      });
      query.where.$or.push({
        createdAt: dateRage,
      });
      delete query.where.end;
      delete query.where.start;
    }
    const rta = await this.lib.findAll(query);
    return rta;
  }

  async findAllLeadByReferralTypeFromAffiliate(
    req: Request,
    query: QuerySearchAnyDto,
    referralTypeShortName: string,
  ) {
    query.where = query.where || {};
    const referralType = await this.getCategoryByShortName(
      referralTypeShortName,
      TagEnum.REFERRAL_TYPE,
    );
    if (!referralType) {
      throw new NotFoundException('Not found referral type');
    }
    query.where.referralType = referralType.id;
    return this.findAllLeadFromAffiliate(req, query);
  }

  async findAllLeadByCountryFromAffiliate(
    req: Request,
    query: QuerySearchAnyDto,
    countryCode: string,
  ) {
    query.where = query.where || {};
    const country = await this.getCategoryByShortName(
      countryCode,
      TagEnum.COUNTRY,
    );
    if (!country) {
      throw new NotFoundException('Not found country');
    }
    // TODO[hender] Validate and Search from database
    //query.where.country = country.id;
    query.where.country = countryCode;
    return this.findAllLeadFromAffiliate(req, query);
  }

  async findAllLeadByReferralFromAffiliate(
    req: Request,
    query: QuerySearchAnyDto,
    referral: string,
  ) {
    query.where = query.where || {};
    query.where.referral = referral;
    return this.findAllLeadFromAffiliate(req, query);
  }

  async findAllLeadByIdFromAffiliate(req: Request, id: string) {
    const query = new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where._id = id;
    return this.findAllLeadFromAffiliate(req, query);
  }

  async findAllLeadByTpIdFromAffiliate(req: Request, tpId: string) {
    const query = new QuerySearchAnyDto();
    query.where = {};
    query.where.tpId = tpId;
    return this.findAllLeadFromAffiliate(req, query);
  }

  async findAllLeadFromAffiliate(req: Request, query: QuerySearchAnyDto) {
    const status = {
      active: 'createdAt',
      contacted: 'dateContacted',
      cftd: 'dateCFTD',
      ftd: 'dateFTD',
    };
    query.where = query.where || {};
    if (!!query.where?.start || !!query.where?.end) {
      // Apply to createdAt
      query.where.createdAt = {};
      if (!!query.where.start) {
        query.where.createdAt.start = query.where.start;
        delete query.where.start;
      }
      if (!!query.where.end) {
        query.where.createdAt.end = query.where.end;
        delete query.where.end;
      }
    }
    const affiliate: AffiliateDocument =
      await this.builder.getPromiseAffiliateEventClient(
        EventsNamesAffiliateEnum.findOneById,
        req['affiliate'],
      );
    if (!affiliate.isAdmin) {
      const salesDpto = await this.getDptoSales();
      query.where.crmDepartment = salesDpto._id;
      query.where.affiliate = req['affiliate'];
    }
    query.relations = ['status', 'statusCrm', 'referralType', 'brand'];
    if (query.where.tpId) {
      query.where.crmIdLead = query.where.tpId;
      delete query.where.tpId;
    }
    if (query.where.accountId) {
      query.where.crmAccountIdLead = query.where.accountId;
      delete query.where.accountId;
    }
    if (query.where.accountPassword) {
      query.where.crmAccountPasswordLead = query.where.accountPassword;
      delete query.where.accountPassword;
    }
    const keys = Object.keys(status);
    for (const key of keys) {
      if (!!query.where[key]) {
        query.where[status[key]] = query.where[key];
        delete query.where[key];
      }
    }
    if (query.where['status']) {
      const name = query.where['status'];
      const paramExist = status[CommonService.getSlug(name)];
      query.where[paramExist] = {
        $exists: true,
      };
      delete query.where['status'];
    }
    query.where['crmDepartment'] = {
      $exists: true,
    };
    //const list = await this.getAll(query);
    const list = await this.builder.getPromiseLeadEventClient(
      EventsNamesLeadEnum.findAll,
      query,
    );
    return this.getPaginatorAffiliate(list, affiliate.isAdmin);
  }

  async statsTransferLeadByAffiliate(
    req: Request,
    tpId: string,
  ): Promise<StatsLeadResponseDto> {
    const lead = await this.getOneByTpId(tpId, ['transfers']);
    if (!lead) {
      throw new BadRequestException(`Not found lead with tpId ${tpId}`);
    }
    const stats = new StatsLeadResponseDto(lead);
    return stats;
  }

  private getConfigPaginatorAffiliate(
    paginator: ResponsePaginator<LeadDocument>,
  ): ResponsePaginator<LeadResponseDto> {
    const pag = new ResponsePaginator<LeadResponseDto>();
    pag.currentPage = paginator.currentPage;
    pag.elementsPerPage = paginator.elementsPerPage;
    pag.firstPage = paginator.firstPage;
    pag.lastPage = paginator.lastPage;
    pag.nextPage = paginator.nextPage;
    pag.order = paginator.order;
    pag.prevPage = paginator.prevPage;
    pag.totalElements = paginator.totalElements;
    return pag;
  }

  getPaginatorAffiliate(
    paginator: ResponsePaginator<LeadDocument>,
    isAdminAffiliate = false,
  ) {
    const pag = this.getConfigPaginatorAffiliate(paginator);
    pag.list = paginator.list.map(
      (lead) => new LeadResponseDto(lead, isAdminAffiliate),
    );
    return pag;
  }

  async getAllMovedLeads(query: QuerySearchAnyDto) {
    query.where = query.where || {};
    const status = await this.builder.getPromiseStatusEventClient(
      EventsNamesStatusEnum.findOneByName,
      'Moved',
    );
    if (!status?._id) {
      throw new BadRequestException('The status "Moved" has not found');
    }
    query.where.statusCrm = {
      $in: status._id,
    };
    return this.lib.findAll(query);
  }

  async getAllActiveLeads(query: QuerySearchAnyDto, active = true) {
    query = query || {};
    query.where = query.where || {};
    query.where.dateCFTD = {
      $exists: false,
    };
    query.where.dateFTD = {
      $exists: false,
    };
    return this.lib.findAll(query);
  }

  async getNew(query: QuerySearchAnyDto) {
    return this.getLeadsByCreated(query, false);
  }

  async getDatabase(query: QuerySearchAnyDto) {
    return this.getLeadsByCreated(query);
  }

  async getTransferFtd(query: QuerySearchAnyDto) {
    query.where = query.where || {};
    if (!query.where.dateFTD) {
      query.where.dateFTD = {
        $exists: true,
      };
    }
    const dptoSales = await this.getDptoSales();
    query.where.crmDepartment = dptoSales._id;
    return this.getAll(query);
  }

  async getTransferFtdDate(query: QuerySearchAnyDto) {
    return this.getTransferFtdByCreatedAt(query);
  }

  async getTransferFtdLate(query: QuerySearchAnyDto) {
    return this.getTransferFtdByCreatedAt(query, true);
  }

  private async getTransferFtdByCreatedAt(
    query: QuerySearchAnyDto,
    old = false,
  ) {
    const date = new Date();
    const dates = {
      start: undefined,
      end: undefined,
    };
    if (old) {
      date.setUTCDate(date.getUTCDate() - 1);
      date.setUTCHours(24, 0, 0, 0);
      dates.end = date;
    } else {
      dates.start = new Date(date);
      dates.end = new Date(date);
      dates.start.setUTCHours(0, 0, 0, 0);
      dates.end.setUTCHours(24, 0, 0, 0);
    }
    query.where = query.where || {};
    query.where.createdAt = dates;
    return this.getTransferFtd(query);
  }

  async getCftd(query: QuerySearchAnyDto) {
    //return this.getLeadsByStatus(query, 'CFTD');
    query.where = query.where || {};
    if (!query.where.dateCFTD) {
      query.where.dateCFTD = {
        $exists: true,
      };
    }
    query.where.dateFTD = {
      $exists: false,
    };
    const dptoSales = await this.getDptoSales();
    query.where.crmDepartment = dptoSales._id;
    return this.getAll(query);
  }

  async getLeadsByStatus(query: QuerySearchAnyDto, statusName: string) {
    query.where = query.where || {};
    const statuses = await this.statusService.getAll({
      where: {
        resources: {
          $in: [ResourcesEnum.LEAD],
        },
        name: statusName,
      },
    });
    const status = statuses.list[0];
    if (!status) {
      throw new BadRequestException('Not find the status "FTD" of Lead');
    }
    //query.where.status = status._id;
    query.where.statusCrm = {
      $in: [status._id],
    };
    return this.getAll(query);
  }

  async getCftdTransferFtd(query: QuerySearchAnyDto) {
    query.where = query.where || {};
    if (query?.where?.createdAt) {
      // TODO[hender - 2024/03/11] Assume the createdAt is the CFTD or FTD date
      query.where.$or = [];
      query.where.$or.push({
        dateCFTD: query.where.createdAt,
      });
      query.where.$or.push({
        dateFTD: query.where.createdAt,
      });
      delete query.where.createdAt;
    } else {
      query.where.$or = [];
      if (query?.where?.dateCFTD) {
        query.where.$or.push({
          dateCFTD: query.where.dateCFTD,
        });
        delete query?.where?.dateCFTD;
      } else {
        query.where.$or.push({
          dateCFTD: {
            $exists: true,
          },
        });
      }
      if (query?.where?.dateFTD) {
        query.where.$or.push({
          dateFTD: query.where.dateFTD,
        });
        delete query?.where?.dateFTD;
      } else {
        query.where.$or.push({
          dateFTD: {
            $exists: true,
          },
        });
      }
    }
    const dptoSales = await this.getDptoSales();
    query.where.crmDepartment = dptoSales._id;
    return this.getAll(query);
  }

  async getRetention(query: QuerySearchAnyDto) {
    //return this.getLeadsByDepartment(query, 'Retention');
    query.where = query.where || {};
    query.where.dateRetention = {
      $exists: true,
    };
    const dptoRetention = await this.getDptoRetention();
    query.where.crmDepartment = dptoRetention._id;
    return this.getAll(query);
  }

  async getLeadsByDepartment(query: QuerySearchAnyDto, nameDepartment: string) {
    query.where = query.where || {};
    const departmentCategory = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: nameDepartment,
        type: TagEnum.DEPARTMENT,
      },
    );
    if (!departmentCategory) {
      throw new BadRequestException(
        `Not find the department "${nameDepartment}"`,
      );
    }
    query.where.crmDepartment = departmentCategory._id;
    return this.getAll(query);
  }

  async getCategoryByShortName(shortName: string, type: TagEnum) {
    const list = await this.categoryService.getAll({
      where: {
        valueText: shortName,
        type: type,
      },
    });
    return list.list[0];
  }

  async getLeadsByCreated(query: QuerySearchAnyDto, old = true) {
    const rules = await this.categoryService.getAll({
      where: {
        type: TagEnum.RULE,
        name: 'is new lead',
      },
    });
    const ruleTimeNewLead = rules.list[0];
    if (!ruleTimeNewLead) {
      throw new BadRequestException('Not find the rule "is new lead"');
    }

    const dptoSales = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        type: TagEnum.DEPARTMENT,
        name: 'Sales',
      },
    );
    if (!dptoSales?._id) {
      throw new BadRequestException('Not find the department "Sales"');
    }

    const date = new Date();
    if (old) {
      //date.setUTCHours(-24);
      date.setUTCDate(date.getUTCDate() - 1);
    }
    const dates = {
      start: new Date(date),
      end: new Date(date),
    };
    dates.start.setUTCHours(0, 0, 0, 0);
    dates.end.setUTCHours(24, 0, 0, 0);
    if (!!ruleTimeNewLead.valueNumber) {
      dates.start.setUTCSeconds(
        date.getUTCSeconds() - ruleTimeNewLead.valueNumber,
      );
    } else if (!!ruleTimeNewLead.valueText) {
      switch (ruleTimeNewLead.valueText) {
        case 'today':
          dates.start.setUTCDate(date.getUTCDate());
          dates.end.setUTCDate(date.getUTCDate());
          dates.end.setUTCHours(23, 59, 59, 999);
          break;
        case 'yesterday':
          dates.start.setUTCHours(-24);
          dates.end.setUTCHours(-24);
          break;
        case 'this-week':
          const day = date.getDay(),
            diff = date.getUTCDate() - day + (day == 0 ? -6 : 1);
          dates.start.setUTCDate(diff); // Monday
          dates.end.setUTCDate(diff + 7); // Sunday
          break;
        case 'this-month':
          dates.start.setUTCDate(1);
          dates.end = new Date(
            dates.end.getUTCFullYear(),
            dates.end.getUTCMonth() + 1,
            1,
          );
          break;
        case 'this-year':
          dates.start.setUTCDate(1);
          dates.start.setUTCMonth(0);
          dates.end = new Date(dates.end.getUTCFullYear() + 1, 0, 1);
          break;
      }
    } else {
      throw new BadRequestException('Not find the rule configuration');
    }
    // TODO[hender] Added keyword for time (today, yesterday, this week, this month)
    // TODO[hender] "today" = starts today at 0h and ends today at 23:59
    // TODO[hender] "yesterday" = starts yesterday at 0h and ends yesterday at 23:59
    // TODO[hender] "this week" = starts on monday at 0h and ends the next sunday at 23:59
    // TODO[hender] "this month" = starts on the first day of the month at 0h and ends on the last day of the month at 23:59
    query.where = query.where || {};
    //query.where.status = statusActive._id;
    query.where.crmDepartment = dptoSales._id;

    const ruleMoneyToCFTD = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        type: TagEnum.RULE,
        name: 'Money to CFTD from lead',
      },
    );
    if (!ruleMoneyToCFTD?._id) {
      throw new BadRequestException(
        'Not find the rule "Money to CFTD from lead"',
      );
    }
    query.where.totalPayed = {
      $lt: ruleMoneyToCFTD.valueNumber,
    };
    if (old) {
      query.where.$or = query.where.$or || [];
      query.where.$or.push({ createdAt: { $lte: dates.end } });
    } else {
      query.where.createdAt = {
        $gt: dates.start,
      };
    }
    return this.getAll(query);
  }

  async newLead(lead: LeadCreateDto, isNew = true) {
    const name =
      lead.name ||
      lead.personalData.firstName + ' ' + lead.personalData.lastName;
    // Find Lead role
    const roleLead = await this.roleService.getAll({
      where: {
        name: 'Lead',
      },
    });
    // Find Affiliate
    const affiliateLead = await this.affiliateService.getOne(lead.affiliate);
    if (!affiliateLead?.id) {
      throw new BadRequestException('Affiliate not founded');
    }
    // Find Person
    let personLead: PersonDocument;
    if (isValidObjectId(lead.personalData)) {
      personLead = await this.personService.getOne(
        lead.personalData.toString(),
      );
    } else {
      const personList: ResponsePaginator<PersonDocument> =
        await this.personService.getAll({
          where: {
            emails: [lead.personalData.email],
          },
        });
      const firstPerson = personList.list[0];
      if (
        !personList.list.length ||
        firstPerson.email[0] !== lead.personalData.email
      ) {
        // Create Person
        personLead = await this.personService.newPerson(lead.personalData);
      } else {
        // Use Person
        personLead = personList.list[0];
      }
    }
    if (!personLead?.id) {
      throw new BadRequestException("The person wasn't finded");
    }

    // Find User
    let userId = personLead?.user;
    if (!userId) {
      // Create user
      const userLead = await this.userService.newUser({
        name: name,
        role: roleLead.list[0].id,
        email: personLead.email[0],
        password: lead.password,
        confirmPassword: lead.password,
      } as unknown as UserRegisterDto);
      delete lead.password;
      userId = userLead.id;
    }
    // Asign status
    //const statuses
    // Asign data
    lead.name = lead.name || name;
    lead.personalData = personLead.id.toString();
    personLead.user = userId;
    let leadSaved = null;
    try {
      await personLead.save();
      lead.user = userId;
      // Create Lead
      leadSaved = await this.lib.create(lead);
      this.sendEventCheckStats(leadSaved);
      const emitConfig = {
        eventName: EventsNamesCrmEnum.moveOneLeadOnCrm,
        data: {
          secretKey: affiliateLead.publicKey,
          leadDto: leadSaved,
        },
      };
      if (isNew) {
        emitConfig.eventName = EventsNamesCrmEnum.createOneLeadOnCrm;
      }
      Logger.debug(emitConfig.data, 'Data Lead to register on CRM');
      const rtaLeadCreatedOnCrm = await this.builder.getPromiseCrmEventClient(
        emitConfig.eventName,
        emitConfig.data,
      );
      Logger.debug(rtaLeadCreatedOnCrm, 'Rta Lead Created On Crm');
      if (rtaLeadCreatedOnCrm?.error || rtaLeadCreatedOnCrm?.response?.error) {
        /* await this.builder.getPromiseLeadEventClient(
          EventsNamesLeadEnum.deleteOneById,
          leadSaved._id,
        ); */
        //throw new BadRequestException('lead already exist');
        throw new BadRequestException(
          rtaLeadCreatedOnCrm?.message ?? 'lead already exist',
        );
      } else {
        this.sendEventCheckStats(leadSaved);
      }
      return leadSaved;
    } catch (err) {
      /* if (!!leadSaved?._id) {
        await this.builder.getPromiseLeadEventClient(
          EventsNamesLeadEnum.deleteOneById,
          leadSaved._id,
        );
      } */
      //throw new InternalServerErrorException('Lead was not created');
      Logger.error(err, 'Lead was not created');
      throw new BadRequestException('Lead was not created');
    }
  }

  async newManyLead(createLeadsDto: LeadCreateDto[]) {
    const leadsCreated = [];
    for (const leadDto of createLeadsDto) {
      leadsCreated.push(await this.newLead(leadDto));
    }
    return leadsCreated;
  }

  async updateLead(lead: LeadUpdateDto) {
    if (!lead.id) {
      //throw new BadRequestException('Not found id lead');
      return null;
    }
    const leadSaved = await this.lib.update(lead.id?.toString(), lead);
    await this.sendEventCheckStats(leadSaved);
    return leadSaved;
  }

  async updateManyLeads(leads: LeadUpdateDto[]) {
    const leadsSaved = [];
    for (const leadDto of leads) {
      leadsSaved.push(this.updateLead(leadDto));
    }
    return Promise.all(leadsSaved);
  }

  async deleteLead(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyLeads(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async createTransaction(createTransactionLeadDto: TransactionLeadCreateDto) {
    const lead = await this.getOneByTpId(createTransactionLeadDto.tpId);
    if (!lead) {
      throw new BadRequestException('The lead is not exist.');
    }
    const libPsp = await this.libPsp.create({
      lead: lead.id,
      amount: createTransactionLeadDto.amount,
      currency: createTransactionLeadDto.currency,
      description: lead.description,
      name: lead.name,
      psp: createTransactionLeadDto.idPsp,
    });
    return libPsp;
  }

  async redirectAddLeadAffiliate(leadDto: CreateLeadAffiliateDto) {
    try {
      if (!leadDto.phone && !leadDto.telephone) {
        throw new BadRequestException(
          `Can't create lead whitout phone or telephone`,
        );
      }
      const rta = await this.builder.getPromiseLeadEventClient(
        EventsNamesLeadEnum.addLeadFromAffiliate,
        leadDto,
      );
      return rta;
    } catch (err) {
      return err;
    }
  }

  async createLeadFromAffiliate(
    secretKey: string,
    leadDto: CreateLeadAffiliateDto,
    ctx: RmqContext,
  ) {
    // Check if lead is valid
    if (!leadDto?.name && !leadDto?.firstname && !leadDto?.lastname) {
      CommonService.ack(ctx);
      throw new BadRequestException(
        'I need a lead name or a firstName and lastName',
      );
    }
    const leadValidated: LeadUpdateDto = await this.validateLead(
      leadDto,
      secretKey,
      ctx,
    );
    let lead;
    if (leadValidated.id) {
      lead = await this.lib.update(leadValidated.id, leadValidated);
    } else {
      lead = await this.lib.create(leadValidated as LeadCreateDto);
    }
    if (!lead.crmIdLead) {
      const rtaLeadCreateOnLeverate =
        await this.builder.getPromiseCrmEventClient(
          EventsNamesCrmEnum.createOneLeadOnCrm,
          {
            secretKey,
            leadDto: lead,
          },
        );
      if (rtaLeadCreateOnLeverate?.error) {
        Logger.error(
          rtaLeadCreateOnLeverate?.error,
          `Leverate error with affiliate ${leadValidated.affiliate}`,
        );
        Logger.error(leadValidated, `${LeadServiceService.name}:862`);
        CommonService.ack(ctx);
        if (rtaLeadCreateOnLeverate?.error.code != 401) {
          throw new BadRequestException(
            'lead already exist',
            rtaLeadCreateOnLeverate?.error.message,
          );
        }
        //throw new BadRequestException('contact Affico360 support');
        throw new BadRequestException({
          statusCode: 500,
          message:
            "We've encountered some integration issues, please try again later. If problems continue, contact Affico360 support.",
        });
      } else {
        // TODO[hender - 2024/02/03] Not implemented Check stats One lead
        //this.sendEventCheckStats(lead);
      }
      lead = await this.getLeadFullData(lead.email, lead.affiliate);
    } else {
      // 'statusCrm', 'status', 'referralType', 'personalData'
      lead.statusCrm = leadValidated.statusCrm;
      lead.status = leadValidated.status;
      lead.referralType = leadValidated.referralTypeObj;
      lead.personalData = leadValidated.personalDataObj;
    }
    if (!lead.hasSendDisclaimer) {
      // TODO[hender - 2024/02/03] Not implemented Send email
      //this.sendEventSendEmail(lead);
    }
    return lead;
  }

  async getLeadFullData(email, affiliateId): Promise<LeadDocument> {
    const lead = await this.lib.findAll({
      where: {
        email: email,
        affiliate: affiliateId,
      },
      relations: ['statusCrm', 'status', 'referralType', 'personalData'],
    });
    return lead.totalElements ? lead.list[0] : null;
  }

  async validateLead(
    leadDto: CreateLeadAffiliateDto,
    secretKey: string,
    ctx: RmqContext,
  ): Promise<LeadUpdateDto> {
    // Check if SecretKey is valid
    const affiliate = await this.validateAffiliateSecretKey(secretKey, ctx);
    const leadData = {
      integration: affiliate.creator,
      affiliate: affiliate.id,
      crm: affiliate.crm._id,
      brand: affiliate.businessUnit,
      //crmIdLead: leadCrm.id,
      //statusCrm: leadCrm.fnsStatus,
      description:
        leadDto.description ??
        leadDto.lastname ??
        leadDto.firstname ??
        leadDto.name,
      name: leadDto.name ?? leadDto.firstname + ' ' + leadDto.lastname,
      password: leadDto.password ?? CommonService.generatePassword(6),
      referral: leadDto.referral,
      referralType: leadDto.referralType,
      docId: leadDto.typeDocId + leadDto.numDocId,
      email: leadDto.email,
      country: leadDto.countryIso,
      telephone: leadDto.telephone,
      crmDepartment: affiliate.crm.department,
      ai: leadDto.ai,
      ci: leadDto.ci,
      gi: leadDto.gi,
      userIp: leadDto.userip,
      firstname: leadDto.firstname,
      lastname: leadDto.lastname,
      phone: leadDto.phone,
      so: leadDto.so,
      sub: leadDto.sub,
      MPC_1: leadDto.MPC_1,
      MPC_2: leadDto.MPC_2,
      MPC_3: leadDto.MPC_3,
      MPC_4: leadDto.MPC_4,
      MPC_5: leadDto.MPC_5,
      MPC_6: leadDto.MPC_6,
      MPC_7: leadDto.MPC_7,
      MPC_8: leadDto.MPC_8,
      MPC_9: leadDto.MPC_9,
      MPC_10: leadDto.MPC_10,
      MPC_11: leadDto.MPC_11,
      MPC_12: leadDto.MPC_12,
      ad: leadDto.ad,
      keywords: leadDto.keywords,
      campaign: leadDto.campaign,
      medium: leadDto.medium,
      sourceId: leadDto.sourceId,
      comments: leadDto.comments,
      campaignId: leadDto.campaignId,
    } as LeadUpdateDto;
    const lead = await this.getLeadFullData(leadData.email, affiliate.id);
    if (lead?.id) {
      leadData.id = lead.id || lead._id;
      leadData.status = lead.status;
      leadData.statusCrm = lead.statusCrm;
      leadData.crmIdLead = lead.crmIdLead;
      leadData.crmAccountIdLead = lead.crmAccountIdLead;
      leadData.password = !!lead.crmIdLead ? lead.password : leadData.password;
      leadData.referral = lead.referral ?? leadData.referral;
      leadData.integration = lead.integration ?? leadData.integration;
      leadData.referralType = (
        lead.referralType?.id ?? leadData.referralType
      ).toString();
      leadData.referralTypeObj = lead.referralType;
      leadData.crmDepartment = lead.crmDepartment ?? affiliate.crm.department;
      leadData.description = lead.description ?? leadData.description;
      leadData.country = lead.country ?? leadData.country;
      leadData.personalData = lead.personalData?.id;
      leadData.personalDataObj =
        lead.personalData as unknown as PersonInterface;
      // Data to update
      leadData.name = leadData.name ?? lead.name;
      leadData.docId = leadData.docId ?? lead.docId;
      leadData.telephone = leadData.telephone ?? lead.telephone;
      leadData.ai = leadData.ai ?? lead.ai;
      leadData.ci = leadData.ci ?? lead.ci;
      leadData.gi = leadData.gi ?? lead.gi;
      leadData.userIp = leadData.userIp ?? lead.userIp;
      leadData.firstname = leadData.firstname ?? lead.firstname;
      leadData.lastname = leadData.lastname ?? lead.lastname;
      leadData.phone = leadData.phone ?? lead.phone;
      leadData.so = leadData.so ?? lead.so;
      leadData.sub = leadData.sub ?? lead.sub;
      leadData.MPC_1 = leadData.MPC_1 ?? lead.MPC_1;
      leadData.MPC_2 = leadData.MPC_2 ?? lead.MPC_2;
      leadData.MPC_3 = leadData.MPC_3 ?? lead.MPC_3;
      leadData.MPC_4 = leadData.MPC_4 ?? lead.MPC_4;
      leadData.MPC_5 = leadData.MPC_5 ?? lead.MPC_5;
      leadData.MPC_6 = leadData.MPC_6 ?? lead.MPC_6;
      leadData.MPC_7 = leadData.MPC_7 ?? lead.MPC_7;
      leadData.MPC_8 = leadData.MPC_8 ?? lead.MPC_8;
      leadData.MPC_9 = leadData.MPC_9 ?? lead.MPC_9;
      leadData.MPC_10 = leadData.MPC_10 ?? lead.MPC_10;
      leadData.MPC_11 = leadData.MPC_11 ?? lead.MPC_11;
      leadData.MPC_12 = leadData.MPC_12 ?? lead.MPC_12;
      leadData.ad = leadData.ad;
      leadData.keywords = leadData.keywords ?? lead.keywords;
      leadData.campaign = leadData.campaign ?? lead.campaign;
      leadData.medium = leadData.medium ?? lead.medium;
      leadData.sourceId = leadData.sourceId ?? lead.sourceId;
      leadData.comments = leadData.comments ?? lead.comments;
      leadData.campaignId = leadData.campaignId ?? lead.campaignId;
    }
    return leadData;
  }

  async validateAffiliateSecretKey(
    secretKey: string,
    ctx: RmqContext,
  ): Promise<AffiliateDocument> {
    const affiliates = await this.affiliateService.getAll({
      where: {
        publicKey: secretKey,
      },
      relations: ['crm'],
    });
    const affiliate = affiliates.totalElements ? affiliates.list[0] : null;
    if (affiliate) {
      return affiliate;
    }
    CommonService.ack(ctx);
    throw new BadRequestException(`Affiliate "${secretKey}" isn't valid`);
  }

  async checkTransfersLead(
    leadId: string,
  ): Promise<ResponsePaginator<TransferInterface>> {
    return this.builder.getPromiseTransferEventClient(
      EventsNamesTransferEnum.findByLead,
      leadId,
    );
  }

  async cftdToFtd(cftdToFtdDto: CftdToFtdDto[]) {
    const statusFtd = await this.getStatusFtd();
    if (!statusFtd?._id) {
      throw new BadRequestException('The status "FTD" has not found');
    }
    const leads = [];
    for (const cftd of cftdToFtdDto) {
      const _leads: ResponsePaginator<LeadDocument> = await this.lib.findAll({
        relations: ['personalData'],
        where: {
          _id: cftd.id,
        },
      });
      const lead = _leads.list[0];
      if (!lead?.id) {
        throw new BadRequestException('I need the lead to update');
      }
      lead.showToAffiliate = !!cftd.showToAffiliate;
      if (!!lead.dateCFTD) {
        const oldStatus = lead.status;
        lead.dateFTD = new Date();
        lead.statusCrm = lead.statusCrm ?? [oldStatus];
        lead.statusCrm.push(statusFtd);
        this.sendEventCheckStats(lead);
        leads.push(await lead.save());
      } else {
        leads.push(
          new BadRequestException('The lead must be "CFTD" to "FTD" convert'),
        );
      }
    }
    return leads;
  }

  async moveLead(moveLeadDto: MoveLeadDto[]) {
    const leads = [];
    for (const move of moveLeadDto) {
      // Search lead
      const _leads: ResponsePaginator<LeadDocument> = await this.lib.findAll({
        relations: ['personalData'],
        where: {
          _id: move.lead,
        },
      });
      const lead = _leads.list[0];
      if (!lead?.id) {
        throw new BadRequestException('I need the lead to move');
      }
      // Search brandTo
      const brand: BusinessUnitDocument = await this.businessUnitService.getOne(
        move.brand.toString(),
      );
      if (!brand?.id) {
        throw new BadRequestException('I need the brand to move the lead');
      }
      // Search user
      if (lead.personalData?.user) {
        lead.personalData.user = await this.userService.getOne(
          lead.personalData.user.toString(),
        );
      } else {
        const users: ResponsePaginator<UserDocument> =
          await this.userService.getAll({
            where: {
              email: lead.email,
            },
          });
        if (users.list.length == 1) {
          //throw new BadRequestException("The user must be one, i found " + (users.length > 1?"more than one":"none"));
          lead.personalData.user = users.list[0];
        }
      }
      // Create new lead for BrandTo
      const newLeadDto = {
        name: lead.name,
        docId: lead.docId,
        country: lead.country,
        email: lead.email,
        telephone: lead.telephone,
        description: lead.description,
        crmIdLead: lead.crmIdLead,
        crmAccountIdLead: lead.crmAccountIdLead,
        crmAccountPasswordLead: lead.crmAccountPasswordLead,
        crmDepartment: brand.department,
        totalPayed: lead.totalPayed,
        quantityTransfer: lead.quantityTransfer,
        password:
          lead.personalData?.user?.password ||
          CommonService.generatePassword(6),
        referral: '',
        referralType: 'INT',
        group: lead.group,
        status: lead.status,
        statusCrm: lead.statusCrm,
        personalData: lead.personalData.id,
        user: lead.personalData?.user?.id,
        pspsUsed: lead.transfers,
        crm: brand.currentCrm,
        brand: brand.id,
        affiliate: lead.affiliate,
        dateCFTD: lead.dateCFTD,
        dateFTD: lead.dateFTD,
        hasMoved: false,
      } as unknown as LeadCreateDto;
      const dptRetention = await this.getDptoRetention();
      if (!dptRetention?._id) {
        throw new BadRequestException('Not found Retention department');
      }
      const newLead: LeadDocument = await this.newLead(newLeadDto, false);
      // Inactivate lead
      const movedStatus: ResponsePaginator<StatusDocument> =
        await this.statusService.getAll({
          where: {
            slug: CommonService.getSlug('Moved'),
          },
        });
      const statusMoved = movedStatus.list[0];
      if (!statusMoved?._id) {
        throw new BadGatewayException('Not found status moved');
      }
      await this.updateLead({
        id: lead._id,
        status: statusMoved._id,
        dateRetention: new Date(),
      });
      leads.push(newLead);
    }

    return leads;
  }

  async autologinLead(
    autologinLeadDto: AutologinLeadDto,
    affiliateId: string,
  ): Promise<AutologinLeadResponse> {
    const lead = await this.getOneByEmail(
      autologinLeadDto.email,
      false,
      affiliateId,
    );
    if (
      !lead ||
      lead.password != autologinLeadDto.password ||
      affiliateId !== lead.affiliate._id.toString()
    ) {
      throw new UnauthorizedException('Unauthorized lead');
    }
    if (!lead.crmIdLead || !lead.crmAccountPasswordLead) {
      throw new BadRequestException('Not found lead');
    }
    autologinLeadDto.email = lead.crmIdLead;
    autologinLeadDto.password = lead.crmAccountPasswordLead;
    return this.builder.getPromiseCrmEventClient<AutologinLeadResponse>(
      EventsNamesCrmEnum.autologinLeadOnCrm,
      new AutologinLeadFromAffiliateDto(autologinLeadDto, affiliateId),
    );
  }

  async getAffiliatesFromLeads(leadsToCheck: Array<string> = []) {
    // TODO[hender-30/01/2024] Check the ledas received
    const aggregate = this.lib.model.aggregate();
    const dateUpdatedGte = new Date();
    dateUpdatedGte.setUTCHours(
      dateUpdatedGte.getUTCHours(),
      dateUpdatedGte.getUTCMinutes() - 5,
      0,
      0,
    );
    aggregate.match({
      updatedAt: {
        $gte: dateUpdatedGte,
      },
    });
    aggregate.group({
      _id: '$affiliate',
      leads: {
        $addToSet: {
          _id: '$_id',
          brand: '$brand',
        },
      },
    });
    const affiliates = await aggregate.exec();
    return affiliates;
  }

  async checkAllLeadsForAffiliateStats(affiliateId: string) {
    // TODO[hender - 2024/01/24] Remove only stats today
    if (!isString(affiliateId)) {
      return null;
    }
    await this.builder.getPromiseStatsEventClient(
      EventsNamesStatsEnum.removeAllStatsAffiliate,
      {
        affiliate: affiliateId,
      },
    );
    const affiliateStats = {
      id: affiliateId,
      ...this.getResetStats(),
    } as AffiliateInterface;
    let page = 1;
    let nextPage = 2;
    //const dptoSales = await this.getDptoSales();
    while (nextPage != 1) {
      const leadsToCheck = await this.getAll({
        page,
        where: {
          affiliate: affiliateId,
          //crmDepartment: dptoSales._id,
        },
      });
      if (leadsToCheck.totalElements) {
        const listStatsAffiliate =
          await this.builder.getPromiseStatsEventClient<
            Array<StatsDateAffiliateDocument>
          >(EventsNamesStatsEnum.checkAllStatsAffiliate, {
            list: leadsToCheck.list,
          });
        /* Logger.debug(
          `Checked ${leadsToCheck.totalElements} result ${listStatsAffiliate?.length} total stats generated on page ${leadsToCheck.currentPage} for ${affiliateId} Affiliate`,
          LeadServiceService.name,
        ); */
        this.updateStat(affiliateStats, listStatsAffiliate);
      }
      page = leadsToCheck.nextPage;
      nextPage = leadsToCheck.nextPage;
      Logger.log(
        `Saved page ${leadsToCheck.currentPage} of AFFILIATE ${affiliateId} lead's. Next page ${nextPage}/${leadsToCheck.lastPage}`,
        'Check leads affiliate stats',
      );
    }
    await this.builder.getPromiseAffiliateEventClient(
      EventsNamesAffiliateEnum.updateOne,
      affiliateStats,
    );
  }

  async checkAllStatusLeadsInCrm(affiliateList: Array<string> = []) {
    await this.checkStatusFromLeadsListByStatus(affiliateList);
  }

  private async getDptoRetention() {
    return this.getCategoryByName('Retention');
  }

  private async getDptoSales() {
    return this.getCategoryByName('Sales');
  }

  private async getCategoryByName(name: string) {
    const slug = CommonService.getSlug(name);
    const rta = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      { slug },
    );
    if (!rta?._id) {
      throw new BadRequestException('Not found Retention department');
    }
    return rta;
  }

  private async checkStatusFromLeadsListByStatus(
    affiliateList = [],
    daysBefore = 0,
  ) {
    Logger.debug(`Checking leads modified`, 'checkStatusFromLeadsListByStatus');
    const today = new Date();
    //today.setUTCHours(0, 0, 0, 0);
    if (affiliateList.length === 0) {
      const affiliates = await this.affiliateService.getAll({
        // TODO[hender-28/12/2023] Change to count of affiliates
        take: 1000,
        order: [['createdAt', 'desc']],
      });
      affiliateList = affiliates.list.map((aff) => aff._id);
    }
    const req = {
      leadsToCheck: null,
      affiliatesToCheck: affiliateList,
      start: new Date(
        new Date(today.getTime()).setUTCDate(today.getUTCDate() - daysBefore),
      ),
      end: new Date(new Date(today.getTime()).setUTCHours(23, 59, 59, 999)),
    } as CheckLeadStatusOnCrmDto;
    affiliateList.forEach((affiliateId) => {
      const request = {
        ...req,
        affiliatesToCheck: [affiliateId],
      };
      this.builder.emitCrmEventClient(
        EventsNamesCrmEnum.checkCrmLeadStatus,
        request,
      );
    });
    //this.builder.emitCrmEventClient(EventsNamesCrmEnum.checkCrmLeadStatus, req);
  }

  private sendEventCheckStats(lead: LeadDocument) {
    this.checkAllLeadsForAffiliateStats(lead.affiliate._id);
    /* this.builder.emitStatsEventClient(
      EventsNamesStatsEnum.addNewLeadAllStats,
      lead,
    ); */
  }

  private sendEventSendEmail(lead: LeadDocument) {
    this.builder.emitMessageEventClient(EventsNamesMessageEnum.sendEmail, lead);
  }

  private updateStat(stats: AffiliateInterface, listStats: Array<any>) {
    for (const stat of listStats) {
      if (isArray(stat)) {
        for (const stat1 of stat) {
          stats.quantityLeads += stat1.quantityLeads ?? 0;
          stats.totalLeads += stat1.totalLeads ?? 0;
          stats.quantityFtd += stat1.quantityFtd ?? 0;
          stats.totalFtd += stat1.totalFtd ?? 0;
          stats.quantityCftd += stat1.quantityCftd ?? 0;
          stats.totalCftd += stat1.totalCftd ?? 0;
          stats.totalConversion += stat1.conversion ?? 0;
          stats.quantityAffiliateFtd += stat1.quantityApprovedLead ?? 0;
          stats.totalAffiliateFtd += stat1.totalApprovedLead ?? 0;
          stats.totalAffiliateConversion += stat1.conversionApprovedLead ?? 0;
        }
      } else {
        stats.quantityLeads += stat.quantityLeads ?? 0;
        stats.totalLeads += stat.totalLeads ?? 0;
        stats.quantityFtd += stat.quantityFtd ?? 0;
        stats.totalFtd += stat.totalFtd ?? 0;
        stats.quantityCftd += stat.quantityCftd ?? 0;
        stats.totalCftd += stat.totalCftd ?? 0;
        stats.totalConversion += stat.conversion ?? 0;
        stats.quantityAffiliateFtd += stat.quantityApprovedLead ?? 0;
        stats.totalAffiliateFtd += stat.totalApprovedLead ?? 0;
        stats.totalAffiliateConversion += stat.conversionApprovedLead ?? 0;
      }
    }
  }

  private getResetStats() {
    return {
      quantityLeads: 0,
      totalLeads: 0,
      quantityFtd: 0,
      totalFtd: 0,
      quantityCftd: 0,
      totalCftd: 0,
      totalConversion: 0,
      quantityAffiliateFtd: 0,
      totalAffiliateFtd: 0,
      totalAffiliateConversion: 0,
    };
  }
}
