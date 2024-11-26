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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { ApiKeyCheck } from '@auth/auth/decorators/api-key-check.decorator';
import { PolicyHandlerBusinessUnitCreate } from '@auth/auth/policy/business-unit/policity.handler.business.unit.create';
import { PolicyHandlerBusinessUnitDelete } from '@auth/auth/policy/business-unit/policity.handler.business.unit.delete';
import { PolicyHandlerBusinessUnitRead } from '@auth/auth/policy/business-unit/policity.handler.business.unit.read';
import { PolicyHandlerBusinessUnitUpdate } from '@auth/auth/policy/business-unit/policity.handler.business.unit.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { BusinessUnitCreateDto } from '@business-unit/business-unit/dto/business-unit.create.dto';
import { BusinessUnitUpdateDto } from '@business-unit/business-unit/dto/business-unit.update.dto';
import { BusinessUnitDocument } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
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
import { AuthGuard } from '@nestjs/passport';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import { BusinessUnitServiceService } from './business-unit-service.service';
import EventsNamesBusinessUnitEnum from './enum/events.names.business.unit.enum';

@ApiTags('BUSINESS-UNIT')
@Controller('business-unit')
export class BusinessUnitServiceController implements GenericServiceController {
  constructor(
    private readonly businessUnitService: BusinessUnitServiceService,
  ) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.businessUnitService.getAll(query);
  }

  @ApiKeyCheck()
  @UseGuards(AuthGuard('api-key'))
  @Get()
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitRead())
  async findAllApiKey(@Query() query: QuerySearchAnyDto) {
    query.take = await this.businessUnitService.count(query);
    const rta = await this.businessUnitService.getAll(query);
    rta.list = rta.list.map((bu) => {
      return {
        id: bu._id,
        name: bu.name,
        slug: bu.slug,
      } as BusinessUnitDocument;
    });
    return rta;
  }

  @Get('all/retention')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitRead())
  async findAllRetention(@Query() query: QuerySearchAnyDto) {
    return this.businessUnitService.getAllRetention(query);
  }

  @Get('all/sales')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitRead())
  async findAllSales(@Query() query: QuerySearchAnyDto) {
    return this.businessUnitService.getAllSales(query);
  }

  @Get('all/:departmentName')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitRead())
  async findAllByDepartment(
    @Param('departmentName') departmentName: string,
    @Query() query: QuerySearchAnyDto,
  ) {
    return this.businessUnitService.getAllByDepartment(query, departmentName);
  }

  @Get(':businessUnitID')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitRead())
  async findOneById(@Param('businessUnitID') id: string) {
    return this.businessUnitService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitCreate())
  async createOne(@Body() createBusinessUnitDto: BusinessUnitCreateDto) {
    return this.businessUnitService.newBusinessUnit(createBusinessUnitDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: BusinessUnitCreateDto }))
    createBusinessUnitsDto: BusinessUnitCreateDto[],
  ) {
    return this.businessUnitService.newManyBusinessUnit(createBusinessUnitsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitUpdate())
  async updateOne(@Body() updateBusinessUnitDto: BusinessUnitUpdateDto) {
    return this.businessUnitService.updateBusinessUnit(updateBusinessUnitDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: BusinessUnitUpdateDto }))
    updateBusinessUnitsDto: BusinessUnitUpdateDto[],
  ) {
    return this.businessUnitService.updateManyBusinessUnits(
      updateBusinessUnitsDto,
    );
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: BusinessUnitUpdateDto }))
    ids: BusinessUnitUpdateDto[],
  ) {
    return this.businessUnitService.deleteManyBusinessUnits(
      ids.map((businessUnit) => businessUnit.id.toString()),
    );
  }

  @Delete(':businessUnitID')
  // @CheckPoliciesAbility(new PolicyHandlerBusinessUnitDelete())
  async deleteOneById(@Param('businessUnitID') id: string) {
    return this.businessUnitService.deleteBusinessUnit(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.createMany)
  createManyEvent(
    @Payload() createDto: BusinessUnitCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const brand = this.createMany(createDto);
    CommonService.ack(ctx);
    return brand;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.updateMany)
  updateManyEvent(
    @Payload() updateDto: BusinessUnitUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const brand = this.updateMany(updateDto);
    CommonService.ack(ctx);
    return brand;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const brand = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return brand;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const brand = this.deleteOneById(id);
    CommonService.ack(ctx);
    return brand;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.createOne)
  async createOneEvent(
    @Payload() createBusinessUnitDto: BusinessUnitCreateDto,
    @Ctx() ctx: RmqContext,
  ): Promise<BusinessUnitDocument> {
    const brand = this.businessUnitService.newBusinessUnit(
      createBusinessUnitDto,
    );
    CommonService.ack(ctx);
    return brand;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.findOneById)
  async findOneEvent(
    @Payload() businessUnitId: string,
    @Ctx() ctx: RmqContext,
  ): Promise<BusinessUnitDocument> {
    CommonService.ack(ctx);
    return this.businessUnitService.getOne(businessUnitId);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.findOneByName)
  async findOneEventByName(
    @Payload() businessUnitName: string,
    @Ctx() ctx: RmqContext,
  ): Promise<BusinessUnitDocument> {
    CommonService.ack(ctx);
    const businessUnits = await this.findAll({
      where: {
        name: businessUnitName,
      },
    });
    if (businessUnits.totalElements) {
      return businessUnits.list[0];
    }
    throw new NotFoundException('Not found businessUnit');
  }

  @AllowAnon()
  @EventPattern(EventsNamesBusinessUnitEnum.checkCashierBrands)
  async checkCashierBrands(@Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    this.businessUnitService.checkCashierBrands();
  }
  @AllowAnon()
  @EventPattern(EventsNamesBusinessUnitEnum.checkBrandStats)
  async checkBrandStats(
    @Payload() configCheckStats: ConfigCheckStatsDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.businessUnitService.checkStats(configCheckStats);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesBusinessUnitEnum.updateOne)
  async updateOneEvent(
    @Payload() updateBusinessUnitDto: BusinessUnitUpdateDto,
    @Ctx() ctx: RmqContext,
  ): Promise<BusinessUnitDocument> {
    CommonService.ack(ctx);
    return this.businessUnitService.updateBusinessUnit(updateBusinessUnitDto);
  }
}
