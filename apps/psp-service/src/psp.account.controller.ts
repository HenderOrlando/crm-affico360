import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { PolicyHandlerPspAccountCreate } from '@auth/auth/policy/psp/policity.handler.psp.account.create';
import { PolicyHandlerPspAccountDelete } from '@auth/auth/policy/psp/policity.handler.psp.account.delete';
import { PolicyHandlerPspAccountRead } from '@auth/auth/policy/psp/policity.handler.psp.account.read';
import { PolicyHandlerPspAccountUpdate } from '@auth/auth/policy/psp/policity.handler.psp.account.update';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { PspAccountCreateDto } from '@psp-account/psp-account/dto/psp-account.create.dto';
import { PspAccountUpdateDto } from '@psp-account/psp-account/dto/psp-account.update.dto';
import { PspAccountHasActiveDto } from '@psp-account/psp-account/dto/psp.has.active.dto';
import { PspAccountDocument } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import EventsNamesPspAccountEnum from './enum/events.names.psp.acount.enum';
import { PspAccountServiceService } from './psp.account.service.service';
import { BuildersService } from '@builder/builders';
import EventsNamesPspEnum from './enum/events.names.psp.enum';

@ApiTags('PSP')
@Controller('psp-account')
export class PspAccountController implements GenericServiceController {
  constructor(
    private readonly pspAccountService: PspAccountServiceService,
    private readonly builder: BuildersService,
  ) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.pspAccountService.getAll(query);
  }

  @Get('manual')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountRead())
  async getPspManual() {
    return this.pspAccountService.getPspManual();
  }

  @Get('check-stats')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountRead())
  async checkStatsForAllPspAccount() {
    this.builder.emitPspAccountEventClient(
      EventsNamesPspEnum.checkStatsForAllPspAccount,
      {},
    );
    return {
      data: 'Check stats started',
    };
  }

  @AllowAnon()
  @EventPattern(EventsNamesPspEnum.checkStatsForAllPspAccount)
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  async checkStatsForAllPspAccountEvent(@Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.pspAccountService.checkStatsForAllPspAccount();
  }

  @Get('check-stats/:pspAccountId')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountRead())
  async checkStatsForOneAffiliate(
    @Param('pspAccountId') pspAccountId?: string,
  ) {
    Logger.debug(pspAccountId, 'checkStatsForOneAffiliate.pspAccountId');
    this.builder.emitPspAccountEventClient(
      EventsNamesPspEnum.checkStatsForOnePspAccount,
      pspAccountId,
    );
    return {
      data: 'Check stats started',
    };
  }

  @AllowAnon()
  @EventPattern(EventsNamesPspEnum.checkStatsForOnePspAccount)
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  async checkStatsForOneAffiliateEvent(
    @Payload() pspAccountId: string,
    @Ctx() ctx: RmqContext,
  ) {
    Logger.debug(pspAccountId, 'checkStatsForOneAffiliateEvent.pspAccountId');
    CommonService.ack(ctx);
    return this.pspAccountService.checkStatsForOnePspAccount(pspAccountId);
  }

  @Get(':pspAccountID')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountRead())
  async findOneById(@Param('pspAccountID') id: string) {
    return this.pspAccountService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountCreate())
  async createOne(
    @Body() createPspAccountDto: PspAccountCreateDto,
    @Request() req,
  ) {
    const user = req.user;
    createPspAccountDto.creator = user.id;
    return this.pspAccountService.newPspAccount(createPspAccountDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: PspAccountCreateDto }))
    createPspAccountsDto: PspAccountCreateDto[],
    @Request() req?,
  ) {
    if (req) {
      const user = req.user;
      createPspAccountsDto = createPspAccountsDto.map((dto) => {
        dto.creator = user.id;
        return dto;
      });
    }
    return this.pspAccountService.newManyPspAccount(createPspAccountsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountUpdate())
  async updateOne(@Body() updatePspAccountDto: PspAccountUpdateDto) {
    return this.pspAccountService.updatePspAccount(updatePspAccountDto);
  }

  @Patch('set-active')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountUpdate())
  async hasActiveOne(@Body() updatePspDto: PspAccountHasActiveDto) {
    return this.pspAccountService.hasActiveOnePsp(updatePspDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: PspAccountUpdateDto }))
    updatePspsAccountDto: PspAccountUpdateDto[],
  ) {
    return this.pspAccountService.updateManyPsps(updatePspsAccountDto);
  }

  @Delete(':pspID')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountDelete())
  async deleteOneById(@Param('pspID') id: string) {
    return this.pspAccountService.deletePspAccount(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspAccountDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: PspAccountUpdateDto }))
    ids: PspAccountUpdateDto[],
  ) {
    return this.pspAccountService.deleteManyPspsAccount(
      ids.map((psp) => psp.id.toString()),
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.createOne)
  async createOneEvent(
    @Payload() createPspAccountDto: PspAccountCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    // TODO[hender 16-08-2023] Creator is not available
    /* if (!createPspAccountDto.creator) {
      throw new RpcException('Creator not found');
    } */
    const pspAccount = await this.pspAccountService.newPspAccount(
      createPspAccountDto,
    );
    CommonService.ack(ctx);
    return pspAccount;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.findOneById)
  async findOneEvent(
    @Payload() pspAccountId: string,
    @Ctx() ctx: RmqContext,
  ): Promise<PspAccountDocument> {
    CommonService.ack(ctx);
    return this.pspAccountService.getOne(pspAccountId);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.findOneByCode)
  async findOneByCodeEvent(
    @Payload() pspAccountCode: string,
    @Ctx() ctx: RmqContext,
  ): Promise<PspAccountDocument> {
    CommonService.ack(ctx);
    const pspAccount = await this.pspAccountService.getAll({
      where: {
        idCashier: pspAccountCode,
      },
    });
    return pspAccount.list[0];
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.findOneByName)
  async findOneEventByName(
    @Payload() pspAccountName: string,
    @Ctx() ctx: RmqContext,
  ): Promise<PspAccountDocument> {
    CommonService.ack(ctx);
    const pspAccounts = await this.findAll({
      where: {
        name: pspAccountName,
      },
    });
    if (pspAccounts.totalElements) {
      return pspAccounts.list[0];
    }
    //throw new NotFoundException('Not found pspAccount');
    return null;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.findAll)
  async findAllEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ): Promise<ResponsePaginator<PspAccountDocument>> {
    CommonService.ack(ctx);
    return this.pspAccountService.getAll(query);
  }

  @AllowAnon()
  @EventPattern(EventsNamesPspAccountEnum.checkPspAccountStats)
  async checkStatsLead(
    @Payload() configCheckStats: ConfigCheckStatsDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.pspAccountService.checkStatsPspAccount(configCheckStats);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.updateOne)
  async updateOneEvent(
    @Payload() updatePspAccountDto: PspAccountUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const pspAccount = await this.pspAccountService.updatePspAccount(
      updatePspAccountDto,
    );
    CommonService.ack(ctx);
    return pspAccount;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspAccountEnum.countPspAccount)
  async countEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.pspAccountService.countPspsAccount(query);
  }

  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  createManyEvent(
    @Payload() createsDto: PspAccountCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const pspAccount = this.createMany(createsDto);
    CommonService.ack(ctx);
    return pspAccount;
  }

  updateManyEvent(
    @Payload() updatesDto: PspAccountUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const pspAccount = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return pspAccount;
  }

  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const pspAccount = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return pspAccount;
  }

  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const pspAccount = this.deleteOneById(id);
    CommonService.ack(ctx);
    return pspAccount;
  }
}
