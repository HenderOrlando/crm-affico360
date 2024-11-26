import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CommonService } from '@common/common';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Lead, LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import {
  Controller,
  Get,
  Inject,
  Logger,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import {
  Query,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { StatsDateCreateDto } from '@stats/stats/dto/stats.date.create.dto';
import { StatsDateAffiliateDocument } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { TransferDocument } from '@transfer/transfer/entities/mongoose/transfer.schema';
import EventsNamesStatsEnum from './enum/events.names.stats.enum';
import { StatsServiceService } from './stats-service.service';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import { BuildersService } from '@builder/builders';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { StatsAllService } from './stats-all.service';
import { StatsDateAllCreateDto } from '@stats/stats/dto/stats.date.all.create.dto';
import { LeadUpdateDto } from '@lead/lead/dto/lead.update.dto';

@Controller('stats')
export class StatsServiceController {
  constructor(
    private readonly statsAllService: StatsAllService,
    private readonly statsServiceService: StatsServiceService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
  ) {}

  @Get()
  async checkStatsDateAll(@Query() query?: QuerySearchAnyDto) {
    return this.statsServiceService.checkStatsDateAll(query);
  }

  @Get('transfer')
  async getStatsTransfer(/* @Query() query: QuerySearchAnyDto */) {
    return this.statsServiceService.getStatsTransfer(/* query */);
  }

  @Get('affiliates/global')
  async getStatsAffiliateGlobal(
    @Query() query: QuerySearchAnyDto,
    @Req() req?,
  ) {
    query = await this.filterFromUserPermissions(query, req);
    return this.statsServiceService.getGlobalStatDailyDBAffiliate(
      query,
      query.where?.department,
    );
  }

  @Get('psp-accounts/global')
  async getStatsPspAccount(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.statsServiceService.getGlobalStatDailyDBPspAccount(query);
  }

  @Get('retention')
  async getStatsDateRetention(@Query() query?: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.statsServiceService.getStatsDateRetention(query);
  }

  @Get('affiliates')
  async getStatsAffiliate(@Query() query?: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.statsServiceService.getStatsDateAffiliates(
      query,
      query.where?.department,
    );
  }

  @Get('affiliates/:affiliateId')
  async getStatsDateAffiliate(@Param('affiliateId') affiliateId: string) {
    return this.statsServiceService.getStatsDateAffiliate(affiliateId);
  }

  @Get('psp-accounts')
  async getStatsDatePspAccounts(
    @Query() query?: QuerySearchAnyDto,
    @Req() req?,
  ) {
    query = await this.filterFromUserPermissions(query, req);
    return this.statsServiceService.getStatsDatePspAccounts(
      query,
      query.where?.department,
    );
  }

  @Get('psp-accounts/:pspAccountId')
  async getStatsDatePspAccount(@Param('pspAccountId') pspAccountId: string) {
    return this.statsServiceService.getStatsDatePspAccount(pspAccountId);
  }

  @Get('brands')
  async getStatsDateBrands(@Query() query?: QuerySearchAnyDto) {
    throw new NotImplementedException();
  }

  @Get('brands/:brandId')
  async getStatsDateBrand(@Param('brandId') brandId: string) {
    throw new NotImplementedException();
  }

  @Get('crms')
  async getStatsDateCrms(@Query() query?: QuerySearchAnyDto) {
    throw new NotImplementedException();
  }

  @Get('crms/:crmId')
  async getStatsDateCrm(@Param('crmId') crmId: string) {
    throw new NotImplementedException();
  }

  @Get('psps')
  async getStatsDatePsps(@Query() query?: QuerySearchAnyDto) {
    throw new NotImplementedException();
  }

  @Get('psps/:pspId')
  async getStatsDatePsp(@Param('pspId') pspId: string) {
    throw new NotImplementedException();
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsAffiliate)
  async checkStatsAffiliate(
    @Payload() lead: LeadDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsServiceService.checkStatsDateAffiliate(lead);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.checkAllStatsAffiliate)
  async checkAllStatsAffiliate(
    @Payload()
    checkAllDto: {
      list: Array<LeadDocument>;
    },
    @Ctx() ctx: RmqContext,
  ): Promise<Array<StatsDateAffiliateDocument>> {
    CommonService.ack(ctx);
    const rta = await this.statsServiceService.checkAllStatsDateAffiliate(
      checkAllDto.list,
    );
    return rta;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.removeAllStatsAffiliate)
  async removeAllStatsAffiliate(
    @Payload() query: JSON,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.removeAllStatsDateAffiliate(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.checkAllStatsPspAccount)
  async checkAllStatsPspAccount(
    @Payload()
    checkAllDto: {
      list: Array<TransferDocument>;
    },
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.checkAllStatsDatePspAccount(
      checkAllDto.list,
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.removeAllStatsPspAccount)
  async removeAllStatsPspAccount(
    @Payload() query: JSON,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.removeAllStatsDatePspAccount(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.createStat)
  async createStatsPsp(
    @Payload() statCreate: StatsDateCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.createStat(statCreate);
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsPsp)
  async checkStatsPspEvent(
    @Payload() transfer: TransferDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsServiceService.checkStatsPsp(transfer);
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsPspAccount)
  async checkStatsPspAccountEvent(
    @Payload() transfer: TransferDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsServiceService.checkStatsPspAccount(transfer);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.findAllStatsPspAccount)
  async findAllStatsPspAccount(
    @Ctx() ctx: RmqContext,
    @Payload() query?: QuerySearchAnyDto,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.findAllPspAccountStats(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.getStatsAffiliateGlobalEvent)
  async getStatsAffiliateGlobalEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.getGlobalStatDailyDBAffiliate(
      query,
      query.where?.department,
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.getStatsAffiliateEvent)
  async getStatsAffiliateEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsServiceService.getStatsDateAffiliates(
      query,
      query.where?.department,
    );
  }

  //-----------------------------------------------------------------------------

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.addNewLeadAllStats)
  async addNewLeadAllStats(
    @Payload() lead: LeadUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAllService.addNewLead(lead as unknown as Lead);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.addNewCFTDAllStats)
  async addNewCftdAllStats(
    @Payload() lead: LeadUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAllService.addNewCftd(lead as unknown as Lead);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.addNewFTDAllStats)
  async addNewFtdAllStats(
    @Payload() lead: LeadUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAllService.addNewFtd(lead as unknown as Lead);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.addNewFTDAllStats)
  async addNewRetentionAllStats(
    @Payload() lead: LeadUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAllService.addNewRetention(lead as unknown as Lead);
  }

  //-----------------------------------------------------------------------------

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.createAllStat)
  async createAllStatsPsp(
    @Payload() statCreate: StatsDateAllCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAllService.createStat(statCreate);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.findAllStatByDate)
  async findAllStatsPsp(
    @Payload() querySearch: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAllService.findStats(querySearch);
  }

  //-----------------------------------------------------------------------------

  private async filterFromUserPermissions(
    query: QuerySearchAnyDto,
    req,
  ): Promise<QuerySearchAnyDto> {
    const user = req?.user;
    if (user) {
      query.where = query.where ?? {};
      const psps = [];
      const crms = [];
      const brands = [];
      const affiliates = [];
      let isSuperadmin = false;
      for (const permission of user.permissions) {
        if (permission.action === ActionsEnum.MANAGE) {
          isSuperadmin = true;
          break;
        }
        if (permission.scope) {
          if (permission.scope.resourceName === ResourcesEnum.BUSINESS_UNIT) {
            brands.push(permission.scope.resourceId);
          } else if (permission.scope.resourceName === ResourcesEnum.CRM) {
            crms.push(permission.scope.resourceId);
          } else if (permission.scope.resourceName === ResourcesEnum.PSP) {
            psps.push(permission.scope.resourceId);
          } else if (
            permission.scope.resourceName === ResourcesEnum.AFFILIATE
          ) {
            affiliates.push(permission.scope.resourceId);
          }
        }
      }
      /* if (!isSuperadmin) {
        query.where.$or = [];
        if (brands.length) {
          query.where.$or.push({
            brand: {
              $in: brands,
            },
          });
        }
        if (psps.length) {
          query.where.$or.push({
            psps: {
              $in: psps,
            },
          });
        }
        if (crms.length) {
          query.where.$or.push({
            crm: {
              $in: crms,
            },
          });
        }
        if (affiliates.length) {
          query.where.$or.push({
            affiliate: {
              $in: affiliates,
            },
          });
        }
      } */
      if (!isSuperadmin) {
        if (brands.length) {
          query.where.brand = {
            $in: brands,
          };
        }
        if (psps.length) {
          query.where.psps = {
            $in: psps,
          };
        }
        if (crms.length) {
          query.where.crm = {
            $in: crms,
          };
        }
        if (affiliates.length) {
          query.where.affiliate = {
            $in: affiliates,
          };
        }
      }
      if (req.user?.userParent) {
        //TODO[hender - 14/02/2024] If userParent,search only data of affiliates with userParent as user
        const affiliates = await this.builder.getPromiseAffiliateEventClient(
          EventsNamesAffiliateEnum.findAll,
          {
            take: 100000,
            where: {
              user: req.user?.userParent,
            },
          },
        );
        query.where.affiliate = {
          $in: affiliates.list.map((affiliate) => affiliate._id),
        };
      }
    }
    return query;
  }
}
