import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CommonService } from '@common/common';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import {
  Controller,
  Get,
  Logger,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
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
import { StatsAffiliateServiceService } from './stats-affiliate-service.service';

@Controller('stats')
export class StatsAffiliateServiceController {
  constructor(
    private readonly statsAffiliateServiceService: StatsAffiliateServiceService,
  ) {}

  @Get('transfer')
  async getStatsTransfer(/* @Query() query: QuerySearchAnyDto */) {
    return this.statsAffiliateServiceService.getStatsTransfer(/* query */);
  }

  @Get('affiliates/global')
  async getStatsAffiliate(@Query() query: QuerySearchAnyDto) {
    return this.statsAffiliateServiceService.getGlobalStatDailyDBAffiliate(
      query,
    );
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsAffiliate)
  async checkStatsAffiliate(
    @Payload() lead: LeadDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsAffiliateServiceService.checkStatsDateAffiliate(lead);
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
    Logger.debug(
      JSON.stringify(checkAllDto),
      'Stats Affiliate service controller',
    );
    /* const rta =
      await this.statsAffiliateServiceService.checkAllStatsDateAffiliate(
        checkAllDto.list,
      );
    return rta;
     */
    return null;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.removeAllStatsAffiliate)
  async removeAllStatsAffiliate(
    @Payload() query: JSON,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAffiliateServiceService.removeAllStatsDateAffiliate(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.createStat)
  async removeAllStatsPsp(
    @Payload() statCreate: StatsDateCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsAffiliateServiceService.createStat(statCreate);
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsPsp)
  async checkStatsPspEvent(
    @Payload() transfer: TransferDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsAffiliateServiceService.checkStatsPsp(transfer);
  }

  //

  @Get('retention')
  async getStatsDateRetention(@Query() query?: QuerySearchAnyDto) {
    return this.statsAffiliateServiceService.getStatsDateRetention(query);
  }

  @Get('affiliates')
  async getStatsDateAffiliates(@Query() query?: QuerySearchAnyDto) {
    return this.statsAffiliateServiceService.getStatsDateAffiliates(query);
  }

  @Get('affiliates/:affiliateId')
  async getStatsDateAffiliate(@Param('affiliateId') affiliateId: string) {
    return this.statsAffiliateServiceService.getStatsDateAffiliate(affiliateId);
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
}
