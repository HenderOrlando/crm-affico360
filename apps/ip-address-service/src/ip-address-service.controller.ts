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
import { PolicyHandlerIpAddressCreate } from '@auth/auth/policy/ip-address/policity.handler.ip.address.create';
import { PolicyHandlerIpAddressDelete } from '@auth/auth/policy/ip-address/policity.handler.ip.address.delete';
import { PolicyHandlerIpAddressRead } from '@auth/auth/policy/ip-address/policity.handler.ip.address.read';
import { PolicyHandlerIpAddressUpdate } from '@auth/auth/policy/ip-address/policity.handler.ip.address.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { IpAddressCreateDto } from '@ip-address/ip-address/dto/ip-address.create.dto';
import { IpAddressUpdateDto } from '@ip-address/ip-address/dto/ip-address.update.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import EventsNamesIpAddressEnum from './enum/events.names.ip.address.enum';
import { IpAddressServiceService } from './ip-address-service.service';

@ApiTags('IPADDRESS')
@Controller('ipAddress')
export class IpAddressServiceController implements GenericServiceController {
  constructor(private readonly ipaddressService: IpAddressServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.ipaddressService.getAll(query);
  }

  @Get(':ipaddressID')
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressRead())
  async findOneById(@Param('ipaddressID') id: string) {
    return this.ipaddressService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressCreate())
  async createOne(@Body() createIpAddressDto: IpAddressCreateDto) {
    return this.ipaddressService.newIpAddress(createIpAddressDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: IpAddressCreateDto }))
    createIpAddresssDto: IpAddressCreateDto[],
  ) {
    return this.ipaddressService.newManyIpAddress(createIpAddresssDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressUpdate())
  async updateOne(@Body() updateIpAddressDto: IpAddressUpdateDto) {
    return this.ipaddressService.updateIpAddress(updateIpAddressDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: IpAddressUpdateDto }))
    updateIpAddresssDto: IpAddressUpdateDto[],
  ) {
    return this.ipaddressService.updateManyIpAddresses(updateIpAddresssDto);
  }

  @Delete(':ipaddressID')
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressDelete())
  async deleteOneById(@Param('ipaddressID') id: string) {
    return this.ipaddressService.deleteIpAddress(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerIpAddressDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: IpAddressUpdateDto }))
    ids: UpdateAnyDto[],
  ) {
    return this.ipaddressService.deleteManyIpAddresses(
      ids.map((ipaddress) => ipaddress.id),
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.createOne)
  createOneEvent(
    @Payload() createDto: IpAddressCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const ipaddress = this.createOne(createDto);
    CommonService.ack(ctx);
    return ipaddress;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.createMany)
  createManyEvent(
    @Payload() createsDto: IpAddressCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const ipaddress = this.createMany(createsDto);
    CommonService.ack(ctx);
    return ipaddress;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.updateOne)
  updateOneEvent(
    @Payload() updateDto: IpAddressUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const ipaddress = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return ipaddress;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: IpAddressUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const ipaddress = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return ipaddress;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const ipaddress = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return ipaddress;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesIpAddressEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const ipaddress = this.deleteOneById(id);
    CommonService.ack(ctx);
    return ipaddress;
  }
}
