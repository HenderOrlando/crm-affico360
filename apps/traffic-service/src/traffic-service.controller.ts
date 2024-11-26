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
import { PolicyHandlerTrafficCreate } from '@auth/auth/policy/traffic/policity.handler.traffic.create';
import { PolicyHandlerTrafficDelete } from '@auth/auth/policy/traffic/policity.handler.traffic.delete';
import { PolicyHandlerTrafficRead } from '@auth/auth/policy/traffic/policity.handler.traffic.read';
import { PolicyHandlerTrafficUpdate } from '@auth/auth/policy/traffic/policity.handler.traffic.update';
import { CommonService } from '@common/common';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BlockTrafficDto } from '@traffic/traffic/dto/block.traffic.dto';
import { TrafficCreateDto } from '@traffic/traffic/dto/traffic.create.dto';
import { TrafficUpdateDto } from '@traffic/traffic/dto/traffic.update.dto';
import EventsNamesTrafficEnum from './enum/events.names.traffic.enum';
import { TrafficServiceService } from './traffic-service.service';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';

@ApiTags('TRAFFIC')
@Controller('traffic')
export class TrafficServiceController implements GenericServiceController {
  static eventsName = {
    blockTrafficAffiliate: 'traffic.blockTrafficAffiliate',
  };
  constructor(private readonly trafficService: TrafficServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerTrafficRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.trafficService.getAll(query);
  }

  @Get(':trafficID')
  // @CheckPoliciesAbility(new PolicyHandlerTrafficRead())
  async findOneById(@Param('trafficID') id: string) {
    return this.trafficService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerTrafficCreate())
  async createOne(@Body() createTrafficDto: TrafficCreateDto) {
    return this.trafficService.newTraffic(createTrafficDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerTrafficCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: TrafficCreateDto }))
    createTrafficsDto: TrafficCreateDto[],
  ) {
    return this.trafficService.newManyTraffic(createTrafficsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerTrafficUpdate())
  async updateOne(@Body() updateTrafficDto: TrafficUpdateDto) {
    return this.trafficService.updateTraffic(updateTrafficDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerTrafficUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: TrafficUpdateDto }))
    updateTrafficsDto: TrafficUpdateDto[],
  ) {
    return this.trafficService.updateManyTraffics(updateTrafficsDto);
  }

  @Delete(':trafficID')
  // @CheckPoliciesAbility(new PolicyHandlerTrafficDelete())
  async deleteOneById(@Param('trafficID') id: string) {
    return this.trafficService.deleteTraffic(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerTrafficDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: TrafficUpdateDto }))
    ids: TrafficUpdateDto[],
  ) {
    return this.trafficService.deleteManyTraffics(
      ids.map((traffic) => traffic.id),
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.createOne)
  createOneEvent(
    @Payload() createDto: TrafficCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const traffic = this.createOne(createDto);
    CommonService.ack(ctx);
    return traffic;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.createMany)
  createManyEvent(
    @Payload() createsDto: TrafficCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const traffic = this.createMany(createsDto);
    CommonService.ack(ctx);
    return traffic;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.updateOne)
  updateOneEvent(
    @Payload() updateDto: TrafficUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const traffic = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return traffic;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: TrafficUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const traffic = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return traffic;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const traffic = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return traffic;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const traffic = this.deleteOneById(id);
    CommonService.ack(ctx);
    return traffic;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTrafficEnum.blockTrafficAffiliate)
  async blockTrafficAffiliate(
    @Payload() block: BlockTrafficDto,
    @Ctx() ctx: RmqContext,
  ) {
    const promises = [];
    if (block.type === 'source') {
      for (const data of block.data) {
        promises.push(this.trafficService.blockTrafficSources(data));
      }
    } else if (block.type === 'source-type') {
      for (const data of block.data) {
        promises.push(this.trafficService.blockTrafficSourcesType(data));
      }
    } else if (block.type === 'country') {
      for (const data of block.data) {
        promises.push(this.trafficService.blockTrafficCountries(data));
      }
    }
    return Promise.all(promises).finally(() => {
      CommonService.ack(ctx);
    });
  }
}
