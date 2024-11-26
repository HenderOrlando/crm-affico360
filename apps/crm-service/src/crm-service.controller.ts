import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { PolicyHandlerCategoryRead } from '@auth/auth/policy/category/policity.handler.category.read';
import { PolicyHandlerCrmCreate } from '@auth/auth/policy/crm/policity.handler.crm.create';
import { PolicyHandlerCrmDelete } from '@auth/auth/policy/crm/policity.handler.crm.delete';
import { PolicyHandlerCrmRead } from '@auth/auth/policy/crm/policity.handler.crm.read';
import { PolicyHandlerCrmUpdate } from '@auth/auth/policy/crm/policity.handler.crm.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { CrmCreateDto } from '@crm/crm/dto/crm.create.dto';
import { CrmUpdateDto } from '@crm/crm/dto/crm.update.dto';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { CrmServiceService } from './crm-service.service';
import { AutologinLeadFromAffiliateDto } from './dto/autologin.lead.from.affiliate.dto';
import { CreateLeadOnCrmDto } from './dto/create.lead.on.crm.dto';
import { CreateTransferOnCrmDto } from './dto/create.transfer.on.crm.dto';
import EventsNamesCrmEnum from './enum/events.names.crm.enum';
import { LeadsToCheckStatusDto } from './dto/leads.to.check.status.dto';
import { CheckLeadStatusOnCrmDto } from './dto/check.lead.status.on.crm.dto';

@ApiTags('CRM')
@Controller('crm')
export class CrmServiceController implements GenericServiceController {
  constructor(private readonly crmService: CrmServiceService) {}

  @Get('all/retention')
  // @CheckPoliciesAbility(new PolicyHandlerCategoryRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: CrmEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAllRetention(@Query() query: QuerySearchAnyDto) {
    return this.crmService.getAllRetention(query);
  }

  @Get('all/sales')
  // @CheckPoliciesAbility(new PolicyHandlerCategoryRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: CrmEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAllSales(@Query() query: QuerySearchAnyDto) {
    return this.crmService.getAllSales(query);
  }

  @Get('all/:departmentName')
  // @CheckPoliciesAbility(new PolicyHandlerCategoryRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: CrmEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAllByDepartment(
    @Param('departmentName') departmentName: string,
    @Query() query: QuerySearchAnyDto,
  ) {
    return this.crmService.getAllByDepartment(query, departmentName);
  }

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerCategoryRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: CrmEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.crmService.getAll(query);
  }

  @Get(':crmID')
  // @CheckPoliciesAbility(new PolicyHandlerCrmRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: CrmEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findOneById(@Param('crmID') id: string) {
    return this.crmService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerCrmCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: CrmCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createOne(@Body() createCrmDto: CrmCreateDto) {
    return this.crmService.newCrm(createCrmDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerCrmCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: CrmCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createMany(
    @Body(new ParseArrayPipe({ items: CrmCreateDto }))
    createCrmsDto: CrmCreateDto[],
  ) {
    return this.crmService.newManyCrm(createCrmsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerCrmUpdate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: CrmUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async updateOne(@Body() updateCrmDto: CrmUpdateDto) {
    return this.crmService.updateCrm(updateCrmDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerCrmUpdate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: CrmUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async updateMany(
    @Body(new ParseArrayPipe({ items: CrmUpdateDto }))
    updateCrmsDto: CrmUpdateDto[],
  ) {
    return this.crmService.updateManyCrms(updateCrmsDto);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerCrmDelete())
  @ApiExcludeEndpoint(true)
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: CrmUpdateDto }))
    ids: CrmUpdateDto[],
  ) {
    return this.crmService.deleteManyCrms(ids.map((crm) => crm.id.toString()));
  }

  @Delete(':crmID')
  // @CheckPoliciesAbility(new PolicyHandlerCrmDelete())
  @ApiExcludeEndpoint(true)
  async deleteOneById(@Param('crmID') id: string) {
    return this.crmService.deleteCrm(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.createMany)
  createManyEvent(
    @Payload() createsDto: CrmCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const crm = this.createMany(createsDto);
    CommonService.ack(ctx);
    return crm;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.updateOne)
  updateOneEvent(@Payload() updateDto: CrmUpdateDto, @Ctx() ctx: RmqContext) {
    const crm = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return crm;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: CrmUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const crm = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return crm;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const crm = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return crm;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.deleteOne)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const crm = this.deleteOneById(id);
    CommonService.ack(ctx);
    return crm;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.createOne)
  async createOneEvent(
    @Payload() createCrmDto: CrmCreateDto,
    @Ctx() ctx: RmqContext,
  ): Promise<CrmDocument> {
    const crm = await this.crmService.newCrm(createCrmDto);
    CommonService.ack(ctx);
    return crm;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.findOneById)
  async findOneByIdEvent(
    @Payload() crmId: string,
    @Ctx() ctx: RmqContext,
  ): Promise<CrmDocument> {
    CommonService.ack(ctx);
    return this.crmService.getOne(crmId);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.findOneByName)
  async findOneEventByName(
    @Payload() crmName: string,
    @Ctx() ctx: RmqContext,
  ): Promise<CrmDocument> {
    CommonService.ack(ctx);
    const crms = await this.crmService.getAll({
      where: {
        name: crmName,
      },
    });
    if (crms.totalElements) {
      return crms.list[0];
    }
    throw new NotFoundException('Not found Crm');
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.createOneLeadOnCrm)
  async createOneLeadOnCrmEvent(
    @Payload() data: CreateLeadOnCrmDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.crmService.createOneLeadOnCrm(data);
  }
  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.moveOneLeadOnCrm)
  async moveOneLeadOnCrmEvent(
    @Payload() data: CreateLeadOnCrmDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.crmService.createOneLeadOnCrm(data, true);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.autologinLeadOnCrm)
  async autologinLeadOnCrmEvent(
    @Payload() data: AutologinLeadFromAffiliateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return await this.crmService.autologinLeadOnCrm(data);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.createOneTransferOnCrm)
  async createOneTransferOnCrmEvent(
    @Payload() data: CreateTransferOnCrmDto,
    @Ctx() ctx: RmqContext,
  ): Promise<TransferInterface> {
    const transfer = this.crmService.createOneTransferOnCrm(data);
    CommonService.ack(ctx);
    return transfer;
  }

  @AllowAnon()
  @EventPattern(EventsNamesCrmEnum.checkCrmStats)
  async checkCrmStats(
    @Payload() configCheckStats: ConfigCheckStatsDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.crmService.checkStats(configCheckStats);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesCrmEnum.updateOneCrmById)
  async updateCrmGlobalStats(
    @Payload() updateCrmDto: CrmUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.crmService.updateCrm(updateCrmDto);
  }

  @AllowAnon()
  @EventPattern(EventsNamesCrmEnum.checkCrmLeadStatus)
  async checkCrmLeadStatus(
    @Payload() data: CheckLeadStatusOnCrmDto,
    @Ctx() ctx: RmqContext,
  ) {
    this.crmService.checkCrmLeadStatus(data);
    CommonService.ack(ctx);
  }
}
