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
import { PolicyHandlerRoleCreate } from '@auth/auth/policy/role/policity.handler.role.create';
import { PolicyHandlerRoleDelete } from '@auth/auth/policy/role/policity.handler.role.delete';
import { PolicyHandlerRoleRead } from '@auth/auth/policy/role/policity.handler.role.read';
import { PolicyHandlerRoleUpdate } from '@auth/auth/policy/role/policity.handler.role.update';
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
import { RoleCreateDto } from '@role/role/dto/role.create.dto';
import { RoleUpdateDto } from '@role/role/dto/role.update.dto';
import EventsNamesRoleEnum from './enum/events.names.role.enum';
import { RoleServiceService } from './role-service.service';

@ApiTags('Role')
@Controller('role')
export class RoleServiceController implements GenericServiceController {
  constructor(private readonly roleService: RoleServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerRoleRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.roleService.getAll(query);
  }

  @Get(':roleID')
  // @CheckPoliciesAbility(new PolicyHandlerRoleRead())
  async findOneById(@Param('roleID') id: string) {
    return this.roleService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerRoleCreate())
  async createOne(@Body() createRoleDto: RoleCreateDto) {
    return this.roleService.newRole(createRoleDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerRoleCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: RoleCreateDto }))
    createRolesDto: RoleCreateDto[],
  ) {
    return this.roleService.newManyRole(createRolesDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerRoleUpdate())
  async updateOne(@Body() updateRoleDto: RoleUpdateDto) {
    return this.roleService.updateRole(updateRoleDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerRoleUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: RoleUpdateDto }))
    updateRolesDto: RoleUpdateDto[],
  ) {
    return this.roleService.updateManyRoles(updateRolesDto);
  }

  @Delete(':roleID')
  // @CheckPoliciesAbility(new PolicyHandlerRoleDelete())
  async deleteOneById(@Param('roleID') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerRoleDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: RoleUpdateDto }))
    ids: RoleUpdateDto[],
  ) {
    return this.roleService.deleteManyRoles(ids.map((role) => role.id));
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.createOne)
  createOneEvent(@Payload() createDto: RoleCreateDto, @Ctx() ctx: RmqContext) {
    const role = this.createOne(createDto);
    CommonService.ack(ctx);
    return role;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.createMany)
  createManyEvent(
    @Payload() createsDto: RoleCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const role = this.createMany(createsDto);
    CommonService.ack(ctx);
    return role;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.updateOne)
  updateOneEvent(@Payload() updateDto: RoleUpdateDto, @Ctx() ctx: RmqContext) {
    const role = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return role;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: RoleUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const role = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return role;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const role = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return role;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesRoleEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const role = this.deleteOneById(id);
    CommonService.ack(ctx);
    return role;
  }
}
