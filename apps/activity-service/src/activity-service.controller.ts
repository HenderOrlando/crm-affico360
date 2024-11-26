import { ActivityCreateDto } from '@activity/activity/dto/activity.create.dto';
import { ActivityUpdateDto } from '@activity/activity/dto/activity.update.dto';
import { ActivityDocument } from '@activity/activity/entities/mongoose/activity.schema';
import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { PolicyHandlerActivityCreate } from '@auth/auth/policy/activity/policity.handler.activity.create';
import { PolicyHandlerActivityDelete } from '@auth/auth/policy/activity/policity.handler.activity.delete';
import { PolicyHandlerActivityRead } from '@auth/auth/policy/activity/policity.handler.activity.read';
import { PolicyHandlerActivityUpdate } from '@auth/auth/policy/activity/policity.handler.activity.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
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
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { ActivityServiceService } from './activity-service.service';
import EventsNamesActivityEnum from './enum/events.names.activity.enum';
import { BuildersService } from '@builder/builders';

@ApiTags('ACTIVITY')
@Controller('activity')
export class ActivityServiceController implements GenericServiceController {
  constructor(
    private readonly activityService: ActivityServiceService,
    private readonly builder: BuildersService,
  ) {}

  @Get('health-check')
  // @CheckPoliciesAbility(new PolicyHandlerActivityRead())
  async healthCheck(@Query() query: QuerySearchAnyDto) {
    return {
      status: 200,
      data: 'ok',
    };
  }

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerActivityRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.builder.getPromiseActivityEventClient(
      EventsNamesActivityEnum.findAll,
      query,
    );
  }

  @Get(':activityID')
  // @CheckPoliciesAbility(new PolicyHandlerActivityRead())
  async findOneById(
    @Param('activityID') id: string,
  ): Promise<ActivityDocument> {
    return this.activityService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerActivityCreate())
  async createOne(@Body() createActivityDto: ActivityCreateDto) {
    return this.activityService.newActivity(createActivityDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerActivityCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: ActivityCreateDto }))
    createActivitysDto: ActivityCreateDto[],
  ): Promise<ActivityDocument[]> {
    return this.activityService.newManyActivity(createActivitysDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerActivityUpdate())
  async updateOne(
    @Body() updateActivityDto: ActivityUpdateDto,
  ): Promise<ActivityDocument> {
    return this.activityService.updateActivity(updateActivityDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerActivityUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: ActivityUpdateDto }))
    updateActivitysDto: ActivityUpdateDto[],
  ): Promise<ActivityDocument[]> {
    return this.activityService.updateManyActivitys(updateActivitysDto);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerActivityDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: UpdateAnyDto }))
    ids: UpdateAnyDto[],
  ): Promise<ActivityDocument[]> {
    return this.activityService.deleteManyActivitys(
      ids.map((activity) => activity.id.toString()),
    );
  }

  @Delete(':activityID')
  // @CheckPoliciesAbility(new PolicyHandlerActivityDelete())
  async deleteOneById(
    @Param('activityID') id: string,
  ): Promise<ActivityDocument> {
    return this.activityService.deleteActivity(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.findAll)
  async findAllEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.activityService.getAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.activityService.getOne(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.createOne)
  createOneEvent(
    @Payload() createActivityDto: ActivityCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.activityService.newActivity(createActivityDto);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.createMany)
  async createManyEvent(
    @Payload() createActivitysDto: ActivityCreateDto[],
    @Ctx() ctx: RmqContext,
  ): Promise<ActivityDocument[]> {
    CommonService.ack(ctx);
    return this.activityService.newManyActivity(createActivitysDto);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.updateOne)
  updateOneEvent(
    @Payload() updateActivityDto: ActivityUpdateDto,
    @Ctx() ctx: RmqContext,
  ): Promise<ActivityDocument> {
    CommonService.ack(ctx);
    return this.activityService.updateActivity(updateActivityDto);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.updateMany)
  async updateManyEvent(
    @Payload() updateActivitysDto: ActivityUpdateDto[],
    @Ctx() ctx: RmqContext,
  ): Promise<ActivityDocument[]> {
    CommonService.ack(ctx);
    return this.activityService.updateManyActivitys(updateActivitysDto);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.deleteMany)
  async deleteManyByIdEvent(
    @Payload() ids: ActivityUpdateDto[],
    @Ctx() ctx: RmqContext,
  ): Promise<ActivityDocument[]> {
    CommonService.ack(ctx);
    return this.activityService.deleteManyActivitys(
      ids.map((activity) => activity.id.toString()),
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesActivityEnum.deleteOneById)
  async deleteOneByIdEvent(
    @Payload() id: string,
    @Ctx() ctx: RmqContext,
  ): Promise<ActivityDocument> {
    CommonService.ack(ctx);
    return this.activityService.deleteActivity(id);
  }

  @AllowAnon()
  @EventPattern(EventsNamesActivityEnum.registerActivity)
  async registerActivity(
    @Payload() registerDto: ActivityCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.createOne({
      name:
        registerDto.action +
        ' ' +
        registerDto.resource +
        ' (' +
        new Date().toISOString() +
        ')',
      action: registerDto.action,
      resource: registerDto.resource,
      description: '',
      object: registerDto.object,
      objectBefore: registerDto.objectBefore,
      creator: registerDto.creator,
      category: registerDto.category,
    });
  }
}
