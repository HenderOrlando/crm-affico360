import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { PolicyHandlerPspCreate } from '@auth/auth/policy/psp/policity.handler.psp.create';
import { PolicyHandlerPspDelete } from '@auth/auth/policy/psp/policity.handler.psp.delete';
import { PolicyHandlerPspRead } from '@auth/auth/policy/psp/policity.handler.psp.read';
import { PolicyHandlerPspUpdate } from '@auth/auth/policy/psp/policity.handler.psp.update';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PspCreateDto } from '@psp/psp/dto/psp.create.dto';
import { PspHasActiveDto } from '@psp/psp/dto/psp.has.active.dto';
import { PspUpdateDto } from '@psp/psp/dto/psp.update.dto';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import EventsNamesPspEnum from './enum/events.names.psp.enum';
import { PspServiceService } from './psp-service.service';

@ApiTags('PSP')
@Controller('psp')
export class PspServiceController implements GenericServiceController {
  constructor(private readonly pspService: PspServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.pspService.getAll(query);
  }

  @Get('manual')
  // @CheckPoliciesAbility(new PolicyHandlerPspRead())
  async getPspManual() {
    return this.pspService.getPspManual();
  }

  @Get(':pspID')
  // @CheckPoliciesAbility(new PolicyHandlerPspRead())
  async findOneById(@Param('pspID') id: string) {
    return this.pspService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerPspCreate())
  async createOne(@Body() createPspDto: PspCreateDto) {
    return this.pspService.newPsp(createPspDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: PspCreateDto }))
    createPspsDto: PspCreateDto[],
  ) {
    return this.pspService.newManyPsp(createPspsDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: PspUpdateDto }))
    updatePspsDto: PspUpdateDto[],
  ) {
    return this.pspService.updateManyPsps(updatePspsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerPspUpdate())
  async updateOne(@Body() updatePspDto: PspUpdateDto) {
    return this.pspService.updatePsp(updatePspDto);
  }

  @Patch('set-active')
  // @CheckPoliciesAbility(new PolicyHandlerPspUpdate())
  async hasActiveOne(@Body() updatePspDto: PspHasActiveDto) {
    return this.pspService.hasActiveOnePsp(updatePspDto);
  }

  @Delete(':pspID')
  // @CheckPoliciesAbility(new PolicyHandlerPspDelete())
  async deleteOneById(@Param('pspID') id: string) {
    return this.pspService.deletePsp(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerPspDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: PspUpdateDto }))
    ids: PspUpdateDto[],
  ) {
    return this.pspService.deleteManyPsps(ids.map((psp) => psp.id.toString()));
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.findOneByName)
  async findOneEventByName(
    @Payload() pspName: string,
    @Ctx() ctx: RmqContext,
  ): Promise<PspDocument> {
    CommonService.ack(ctx);
    if (pspName === 'Manual') {
      return this.getPspManual();
    }
    const psps = await this.findAll({
      where: {
        name: pspName,
      },
    });
    if (psps.totalElements) {
      return psps.list[0];
    }
    throw new NotFoundException('Not found psp');
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.findOneById)
  async findOneEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.pspService.getOne(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.createOne)
  async createOneEvent(
    @Payload() createPspDto: PspCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const psp = await this.pspService.newPsp(createPspDto);
    CommonService.ack(ctx);
    return psp;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.updateOne)
  async updateOneEvent(@Payload() updatePspDto: any, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    const psp = await this.pspService.updatePsp(updatePspDto);
    return psp;
  }

  @AllowAnon()
  @EventPattern(EventsNamesPspEnum.checkCashierPsps)
  async checkCashierPsps(@Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    this.pspService.checkCashierPsps();
  }

  @AllowAnon()
  @EventPattern(EventsNamesPspEnum.checkPspStats)
  async checkPspStats(
    @Payload() configCheckStats: ConfigCheckStatsDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.pspService.checkStats(configCheckStats);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.createMany)
  createManyEvent(
    @Payload() createsDto: PspCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const psp = this.createMany(createsDto);
    CommonService.ack(ctx);
    return psp;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: PspUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const psp = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return psp;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const psp = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return psp;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPspEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const psp = this.deleteOneById(id);
    CommonService.ack(ctx);
    return psp;
  }
}
