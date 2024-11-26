import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CommonService } from '@common/common';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import {
  Controller,
  Get,
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
import { TransferDocument } from '@transfer/transfer/entities/mongoose/transfer.schema';
import EventsNamesStatsEnum from './enum/events.names.stats.enum';
import { StatsPspAccountServiceService } from './stats-psp-account-service.service';

@Controller('stats')
export class StatsPspAccountServiceController {
  constructor(
    private readonly statsPspAccountServiceService: StatsPspAccountServiceService,
  ) {}

  @Get('transfer')
  async getStatsTransfer(/* @Query() query: QuerySearchAnyDto */) {
    return this.statsPspAccountServiceService.getStatsTransfer(/* query */);
  }

  @Get('psp-accounts/global')
  async getStatsPspAccount(@Query() query: QuerySearchAnyDto) {
    return this.statsPspAccountServiceService.getGlobalStatDailyDBPspAccount(
      query,
    );
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
    return this.statsPspAccountServiceService.checkAllStatsDatePspAccount(
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
    return this.statsPspAccountServiceService.removeAllStatsDatePspAccount(
      query,
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.createStat)
  async removeAllStatsPsp(
    @Payload() statCreate: StatsDateCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.statsPspAccountServiceService.createStat(statCreate);
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsPsp)
  async checkStatsPspEvent(
    @Payload() transfer: TransferDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsPspAccountServiceService.checkStatsPsp(transfer);
  }

  @AllowAnon()
  @EventPattern(EventsNamesStatsEnum.checkStatsPspAccount)
  async checkStatsPspAccountEvent(
    @Payload() transfer: TransferDocument,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.statsPspAccountServiceService.checkStatsPspAccount(transfer);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatsEnum.findAllStatsPspAccount)
  async findAllStatsPspAccount(
    @Ctx() ctx: RmqContext,
    @Payload() query?: QuerySearchAnyDto,
  ) {
    CommonService.ack(ctx);
    return this.statsPspAccountServiceService.findAllPspAccountStats(query);
  }

  @Get('psp-accounts')
  async getStatsDatePspAccounts(@Query() query?: QuerySearchAnyDto) {
    return this.statsPspAccountServiceService.getStatsDatePspAccounts(query);
  }

  @Get('psp-accounts/:pspAccountId')
  async getStatsDatePspAccount(@Param('pspAccountId') pspAccountId: string) {
    return this.statsPspAccountServiceService.getStatsDatePspAccount(
      pspAccountId,
    );
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
