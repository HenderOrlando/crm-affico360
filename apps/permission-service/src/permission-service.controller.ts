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
import { PolicyHandlerPermissionCreate } from '@auth/auth/policy/permission/policity.handler.permission.create';
import { PolicyHandlerPermissionDelete } from '@auth/auth/policy/permission/policity.handler.permission.delete';
import { PolicyHandlerPermissionRead } from '@auth/auth/policy/permission/policity.handler.permission.read';
import { PolicyHandlerPermissionUpdate } from '@auth/auth/policy/permission/policity.handler.permission.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PermissionCreateDto } from '@permission/permission/dto/permission.create.dto';
import { PermissionUpdateDto } from '@permission/permission/dto/permission.update.dto';
import EventsNamesPermissionEnum from './enum/events.names.permission.enum';
import { PermissionServiceService } from './permission-service.service';

@ApiTags('PERMISSION')
@Controller('permission')
export class PermissionServiceController implements GenericServiceController {
  constructor(private readonly permissionService: PermissionServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    query.take = await this.permissionService.count();
    return this.permissionService.getAll(query);
  }

  @Get('scope')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionRead())
  async findAllScopes(@Query() query: QuerySearchAnyDto) {
    //TODO[hender - 2024/02/21] Added to directory routes
    //query.take = await this.permissionService.count();
    return this.permissionService.findAllScope(query);
  }

  @Get(':permissionID')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionRead())
  async findOneById(@Param('permissionID') id: string) {
    return this.permissionService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerPermissionCreate())
  async createOne(@Body() createPermissionDto: PermissionCreateDto) {
    return this.permissionService.newPermission(createPermissionDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: PermissionCreateDto }))
    createPermissionsDto: PermissionCreateDto[],
  ) {
    return this.permissionService.newManyPermission(createPermissionsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerPermissionUpdate())
  async updateOne(@Body() updatePermissionDto: PermissionUpdateDto) {
    return this.permissionService.updatePermission(updatePermissionDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: PermissionUpdateDto }))
    updatePermissionsDto: PermissionUpdateDto[],
  ) {
    return this.permissionService.updateManyPermissions(updatePermissionsDto);
  }

  @Delete(':permissionID')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionDelete())
  async deleteOneById(@Param('permissionID') id: string) {
    return this.permissionService.deletePermission(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerPermissionDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: PermissionUpdateDto }))
    ids: PermissionUpdateDto[],
  ) {
    return this.permissionService.deleteManyPermissions(
      ids.map((permission) => permission.id),
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.findOneById)
  findOneByIdEvent(id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.createOne)
  createOneEvent(
    @Payload() createDto: PermissionCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const permission = this.createOne(createDto);
    CommonService.ack(ctx);
    return permission;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.createMany)
  createManyEvent(
    @Payload() createsDto: PermissionCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const permission = this.createMany(createsDto);
    CommonService.ack(ctx);
    return permission;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.updateOne)
  updateOneEvent(
    @Payload() updateDto: PermissionUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const permission = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return permission;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: PermissionUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const permission = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return permission;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const permission = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return permission;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const permission = this.deleteOneById(id);
    CommonService.ack(ctx);
    return permission;
  }

  // SCOPE

  @AllowAnon()
  @MessagePattern(EventsNamesPermissionEnum.findAllScope)
  findAllScopeEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.permissionService.findAllScope(query);
  }
}
