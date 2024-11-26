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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { PolicyHandlerUserCreate } from '@auth/auth/policy/user/policity.handler.user.create';
import { PolicyHandlerUserDelete } from '@auth/auth/policy/user/policity.handler.user.delete';
import { PolicyHandlerUserRead } from '@auth/auth/policy/user/policity.handler.user.read';
import { PolicyHandlerUserUpdate } from '@auth/auth/policy/user/policity.handler.user.update';
import { CommonService } from '@common/common';
import ActionsEnum from '@common/common/enums/ActionEnum';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { UserChangePasswordDto } from '@user/user/dto/user.change-password.dto';
import { UserCreateDto } from '@user/user/dto/user.create.dto';
import { UserRegisterDto } from '@user/user/dto/user.register.dto';
import { UserUpdateDto } from '@user/user/dto/user.update.dto';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';
import EventsNamesUserEnum from './enum/events.names.user.enum';
import { UserServiceService } from './user-service.service';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';

@ApiTags('USER')
@Controller('user')
export class UserServiceController implements GenericServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerUserRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.userService.getAll(query);
  }

  @Get(':userID')
  // @CheckPoliciesAbility(new PolicyHandlerUserRead())
  async findOneById(@Param('userID') id: string) {
    return this.userService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerUserCreate())
  async createOne(@Body() createUserDto: UserRegisterDto) {
    return this.userService.newUser(createUserDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerUserCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: UserRegisterDto }))
    createUsersDto: UserRegisterDto[],
  ) {
    return this.userService.newManyUser(createUsersDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerUserUpdate())
  async updateOne(@Body() updateUserDto: UserUpdateDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerUserUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: UserUpdateDto }))
    updateUsersDto: UserUpdateDto[],
  ) {
    return this.userService.updateManyUsers(updateUsersDto);
  }

  @Delete(':userID')
  // @CheckPoliciesAbility(new PolicyHandlerUserDelete())
  async deleteOneById(@Param('userID') id: string) {
    return this.userService.deleteUser(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerUserDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: UserUpdateDto }))
    ids: UserUpdateDto[],
  ) {
    return this.userService.deleteManyUsers(ids.map((user) => user.id));
  }

  @Patch('change-password/:userID')
  @ApiResponse(ResponseAffico.getResponseSwagger(200, ActionsEnum.UPDATE))
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async changePassword(
    @Param('userID') id: ObjectId,
    @Body() changePasswordUserDto: UserChangePasswordDto,
  ) {
    return this.userService.changePasswordUser(id, changePasswordUserDto);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.createOne)
  createOneEvent(@Payload() createDto: UserCreateDto, @Ctx() ctx: RmqContext) {
    const user = this.createOne(createDto);
    CommonService.ack(ctx);
    return user;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.createMany)
  createManyEvent(
    @Payload() createsDto: UserCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const user = this.createMany(createsDto);
    CommonService.ack(ctx);
    return user;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.updateOne)
  updateOneEvent(@Payload() updateDto: UserUpdateDto, @Ctx() ctx: RmqContext) {
    const user = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return user;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: UserUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const user = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return user;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const user = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return user;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const user = this.deleteOneById(id);
    CommonService.ack(ctx);
    return user;
  }

  @AllowAnon()
  @EventPattern(EventsNamesUserEnum.activeTwoFactor)
  async activeTwoFactor(@Payload() user: UserEntity) {
    await this.userService.updateUser({
      id: user.id,
      twoFactorIsActive: true,
    });
  }
}
