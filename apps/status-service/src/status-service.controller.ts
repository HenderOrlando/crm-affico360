import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { PolicyHandlerStatusCreate } from '@auth/auth/policy/status/policity.handler.status.create';
import { PolicyHandlerStatusDelete } from '@auth/auth/policy/status/policity.handler.status.delete';
import { PolicyHandlerStatusRead } from '@auth/auth/policy/status/policity.handler.status.read';
import { PolicyHandlerStatusUpdate } from '@auth/auth/policy/status/policity.handler.status.update';
import { CommonService } from '@common/common';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { StatusCreateDto } from '@status/status/dto/status.create.dto';
import { StatusUpdateDto } from '@status/status/dto/status.update.dto';
import EventsNamesStatusEnum from './enum/events.names.status.enum';
import { StatusServiceService } from './status-service.service';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';

@ApiTags('Status')
@Controller('status')
export class StatusServiceController implements GenericServiceController {
  constructor(private readonly statusService: StatusServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerStatusRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.statusService.getAll(query);
  }

  @Get(':statusID')
  // @CheckPoliciesAbility(new PolicyHandlerStatusRead())
  async findOneById(@Param('statusID') id: string) {
    return this.statusService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerStatusCreate())
  async createOne(@Body() createStatusDto: StatusCreateDto) {
    return this.statusService.newStatus(createStatusDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerStatusCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: StatusCreateDto }))
    createStatussDto: StatusCreateDto[],
  ) {
    return this.statusService.newManyStatus(createStatussDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerStatusUpdate())
  async updateOne(@Body() updateStatusDto: StatusUpdateDto) {
    return this.statusService.updateStatus(updateStatusDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerStatusUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: StatusUpdateDto }))
    updateStatussDto: StatusUpdateDto[],
  ) {
    return this.statusService.updateManyStatuss(updateStatussDto);
  }

  @Delete(':statusID')
  // @CheckPoliciesAbility(new PolicyHandlerStatusDelete())
  async deleteOneById(@Param('statusID') id: string) {
    return this.statusService.deleteStatus(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerStatusDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: StatusUpdateDto }))
    ids: StatusUpdateDto[],
  ) {
    return this.statusService.deleteManyStatuss(ids.map((status) => status.id));
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.createOne)
  createOneEvent(
    @Payload() createDto: StatusCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const status = this.createOne(createDto);
    CommonService.ack(ctx);
    return status;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.createMany)
  createManyEvent(
    @Payload() createsDto: StatusCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const status = this.createMany(createsDto);
    CommonService.ack(ctx);
    return status;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.updateOne)
  updateOneEvent(
    @Payload() updateDto: StatusUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const status = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return status;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: StatusUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const status = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return status;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const status = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return status;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const status = this.deleteOneById(id);
    CommonService.ack(ctx);
    return status;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.findOneByName)
  async findOneStatusByNameMessage(
    @Payload() statusName: string,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    const statusList = await this.statusService.getAll({
      where: {
        slug: CommonService.getSlug(statusName),
      },
    });
    if (statusList.totalElements) {
      return statusList.list[0];
    }
    //throw new RpcException('The status "' + statusName + '" has not found');
    return null;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.findOneByDescription)
  async findOneStatusByDescriptionMessage(
    @Payload() statusDescription: string,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    const statusList = await this.statusService.getAll({
      where: {
        description: statusDescription,
      },
    });
    if (statusList.totalElements) {
      return statusList.list[0];
    }
    //throw new RpcException('The status "' + statusName + '" has not found');
    return null;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesStatusEnum.checkCashierStatus)
  async checkCashierStatus(@Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.statusService.checkCashierStatus();
  }
}
