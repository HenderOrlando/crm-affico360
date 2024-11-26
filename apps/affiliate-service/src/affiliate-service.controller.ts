import { AffiliateCreateDto } from '@affiliate/affiliate/domain/dto/affiliate.create.dto';
import { AffiliateUpdateDto } from '@affiliate/affiliate/domain/dto/affiliate.update.dto';
import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { ApiKeyCheck } from '@auth/auth/decorators/api-key-check.decorator';
import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import { TrafficUpdateDto } from '@traffic/traffic/dto/traffic.update.dto';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import EventsNamesTrafficEnum from 'apps/traffic-service/src/enum/events.names.traffic.enum';

import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { PolicyHandlerAffiliateCreate } from '@auth/auth/policy/affiliate/policity.handler.affiliate.create';
import { PolicyHandlerAffiliateDelete } from '@auth/auth/policy/affiliate/policity.handler.affiliate.delete';
import { PolicyHandlerAffiliateMove } from '@auth/auth/policy/affiliate/policity.handler.affiliate.move';
import { PolicyHandlerAffiliateRead } from '@auth/auth/policy/affiliate/policity.handler.affiliate.read';
import { PolicyHandlerAffiliateSearch } from '@auth/auth/policy/affiliate/policity.handler.affiliate.search';
import { PolicyHandlerAffiliateUpdate } from '@auth/auth/policy/affiliate/policity.handler.affiliate.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { PolicyHandlerAffiliateAll } from '../../../libs/auth/src/policy/affiliate/policity.handler.affiliate.all';
import { AffiliateServiceService } from './affiliate-service.service';
import { MoveTrafficAffiliateDto } from './dto/move.traffic.affiliate.dto';
import EventsNamesAffiliateEnum from './enum/events.names.affiliate.enum';
import EventsNamesGroupEnum from 'apps/group-service/src/enum/events.names.group.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import TagEnum from '@common/common/enums/TagEnum';

@ApiTags('AFFILIATE')
@Controller('affiliate')
export class AffiliateServiceController implements GenericServiceController {
  private eventClient: ClientProxy;
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    private readonly affiliateService: AffiliateServiceService,
  ) {
    this.eventClient = builder.getEventClient();
  }

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: AffiliateEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.affiliateService.getAll(query);
  }

  @ApiKeyCheck()
  @UseGuards(AuthGuard('api-key'))
  @Get()
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: AffiliateEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAllApiKey(
    @Query() query: QuerySearchAnyDto,
    @Request() req: Request,
  ) {
    query = query ?? {};
    query.where = query.where ?? {};
    query.where.creator = req['user']?._id;
    const rta = await this.affiliateService.getAll(query);
    rta.list = (await rta).list.map((aff) => {
      return {
        id: aff.id,
        name: aff.name,
        slug: aff.slug,
        email: aff.email,
        publicKey: aff.publicKey,
      } as AffiliateDocument;
    });
    return rta;
  }

  @Get('check-stats')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  async checkStatsForAllAffiliate() {
    this.builder.emitAffiliateEventClient(
      EventsNamesAffiliateEnum.checkStats,
      {},
    );
    return {
      data: 'Check stats started',
    };
  }

  @Get('check-stats/:affiliateId')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  async checkStatsForOneAffiliate(@Param('affiliateId') affiliateId?: string) {
    Logger.debug(affiliateId, 'checkStatsForOneAffiliate.affiliateId');
    this.builder.emitAffiliateEventClient(
      EventsNamesAffiliateEnum.checkStatsOneAffiliate,
      affiliateId,
    );
    return new Promise((res) => {
      setTimeout(() => {
        res({
          data: 'Check stats started',
        });
      }, 500);
    });
  }

  @Get('byTpId/:tpId')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateSearch())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: AffiliateEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async findOneByTpId(@Param('tpId') tpId: any) {
    return this.affiliateService.getOneByTpId(tpId);
  }

  // Todo[hender-30-01-2024] Add to endpoint list
  @Get('check-stats-affiliates')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateSearch())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: AffiliateEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async checkStatsAffiliates() {
    return this.affiliateService.checkStatsAffiliates();
  }

  @Get(':affiliateID')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateSearch())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: AffiliateEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findOneById(@Param('affiliateID') id: string) {
    return this.affiliateService.getOne(id);
  }

  @Post()
  @ApiKeyCheck()
  @UseGuards(AuthGuard('api-key'))
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createOneApiKey(
    @Body() createAffiliateDto: AffiliateCreateDto,
    @Request() req: Request,
  ) {
    createAffiliateDto.creator = req['user']?._id;
    let integrationGroup = null;
    createAffiliateDto.integrationGroup =
      createAffiliateDto.integrationGroup ?? 'ANG';
    if (createAffiliateDto.integrationGroup) {
      const group = await this.builder.getPromiseGroupEventClient(
        EventsNamesGroupEnum.findAll,
        {
          where: {
            valueGroup: createAffiliateDto.integrationGroup,
          },
        },
      );
      integrationGroup = group.list[0];
    }
    if (!integrationGroup) {
      throw new BadRequestException(
        `Not found Integratio Group "${createAffiliateDto.integrationGroup}"`,
      );
    }
    createAffiliateDto.integrationGroup = integrationGroup._id;
    const group = await this.builder.getPromiseGroupEventClient(
      EventsNamesGroupEnum.findAll,
      {
        where: {
          valueGroup: createAffiliateDto.user.name,
        },
      },
    );
    let affiliateGroup = group.list[0];
    if (!affiliateGroup) {
      const statusActive = await this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'active',
      );
      const categoryIntegration =
        await this.builder.getPromiseCategoryEventClient(
          EventsNamesCategoryEnum.findOneByNameType,
          {
            slug: 'affiliate',
            type: TagEnum.AFFILIATE,
          },
        );
      affiliateGroup = await this.builder.getPromiseGroupEventClient(
        EventsNamesGroupEnum.createOne,
        {
          name: createAffiliateDto.user.name,
          description: createAffiliateDto.user.email,
          category: categoryIntegration._id,
          status: statusActive._id,
        },
      );
    }
    createAffiliateDto.affiliateGroup = affiliateGroup._id;
    const rta = await this.affiliateService.newAffiliate(createAffiliateDto);
    return Promise.resolve({
      id: rta.id,
      name: rta.name,
      slug: rta.slug,
      email: rta.email,
      publicKey: rta.publicKey,
    } as AffiliateDocument);
  }

  @Post('create')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createOne(@Body() createAffiliateDto: AffiliateCreateDto) {
    return this.affiliateService.newAffiliate(createAffiliateDto);
  }

  @Post('check-lead-statuses')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: Array<string>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async checkLeadStatuses(
    @Body(new ParseArrayPipe({ items: String }))
    affiliateIdList: string[],
  ) {
    return this.affiliateService.checkLeadStatuses(affiliateIdList);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createMany(
    @Body(new ParseArrayPipe({ items: AffiliateCreateDto }))
    createAffiliatesDto: AffiliateCreateDto[],
  ) {
    return this.affiliateService.newManyAffiliate(createAffiliatesDto);
  }

  @Post('move')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateMove())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async moveTraffic(
    @Body(new ParseArrayPipe({ items: MoveTrafficAffiliateDto }))
    moveTrafficAffiliateDto: MoveTrafficAffiliateDto[],
  ) {
    return this.affiliateService.moveTrafficAffiliate(moveTrafficAffiliateDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateUpdate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async updateOne(@Body() updateAffiliateDto: AffiliateUpdateDto) {
    return this.affiliateService.updateAffiliate(updateAffiliateDto);
  }

  @Patch('block-traffic/source')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async blockTrafficAffiliateSource(
    @Body(new ParseArrayPipe({ items: TrafficUpdateDto }))
    updateTrafficDto: TrafficUpdateDto[],
  ) {
    return this.eventClient.send(EventsNamesTrafficEnum.blockTrafficAffiliate, {
      type: 'source',
      data: updateTrafficDto,
    });
  }

  @Patch('block-traffic/source-type')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async blockTrafficAffiliateSourceType(
    @Body(new ParseArrayPipe({ items: TrafficUpdateDto }))
    updateTrafficDto: TrafficUpdateDto[],
  ) {
    return this.eventClient.send(EventsNamesTrafficEnum.blockTrafficAffiliate, {
      type: 'source-type',
      data: updateTrafficDto,
    });
  }

  @Patch('block-traffic/country')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async blockTrafficAffiliateCountry(
    @Body(new ParseArrayPipe({ items: TrafficUpdateDto }))
    updateTrafficDto: TrafficUpdateDto[],
  ) {
    return this.eventClient.send(EventsNamesTrafficEnum.blockTrafficAffiliate, {
      type: 'country',
      data: updateTrafficDto,
    });
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateUpdate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: AffiliateUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async updateMany(
    @Body(new ParseArrayPipe({ items: AffiliateUpdateDto }))
    updateAffiliatesDto: AffiliateUpdateDto[],
  ) {
    return this.affiliateService.updateManyAffiliates(updateAffiliatesDto);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateDelete())
  @ApiExcludeEndpoint(true)
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: AffiliateUpdateDto }))
    ids: AffiliateUpdateDto[],
  ) {
    return this.affiliateService.deleteManyAffiliates(
      ids.map((affiliate) => affiliate.id.toString()),
    );
  }

  @Delete(':affiliateID')
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateDelete())
  @ApiExcludeEndpoint(true)
  async deleteOneById(@Param('affiliateID') id: string) {
    return this.affiliateService.deleteAffiliate(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.findOneByPublicKey)
  async findOneByPublicKey(
    @Payload() publicKey: string,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    const rta = await this.affiliateService.getAll({
      where: {
        publicKey,
      },
    });
    if (rta.totalElements > 0) {
      return rta?.list && rta.list[0];
    }
    return null;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.createMany)
  createManyEvent(
    @Payload() createActivitysDto: AffiliateCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const affiliates = this.createMany(createActivitysDto);
    CommonService.ack(ctx);
    return affiliates;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.updateMany)
  updateManyEvent(
    @Payload() updateActivitysDto: AffiliateUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const affiliates = this.updateMany(updateActivitysDto);
    CommonService.ack(ctx);
    return affiliates;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const deleted = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return deleted;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const deleted = this.deleteOneById(id);
    CommonService.ack(ctx);
    return deleted;
  }

  @AllowAnon()
  @EventPattern(EventsNamesAffiliateEnum.checkAffiliateLeadsStats)
  async checkAffiliateLeadsStats(
    @Payload() configCheckStats: ConfigCheckStatsDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    //this.affiliateService.checkStats(configCheckStats);
    await this.affiliateService.checkStatsForOneAffiliate(
      configCheckStats?.affiliateId,
    );
  }

  @AllowAnon()
  @EventPattern(EventsNamesAffiliateEnum.checkAffiliateStats)
  async checkAffiliateStats(
    @Payload() configCheckStats: ConfigCheckStatsDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    //this.affiliateService.checkStats(configCheckStats);
    await this.affiliateService.checkStatsAffiliates();
  }

  @AllowAnon()
  @EventPattern(EventsNamesAffiliateEnum.checkTransferStats)
  async checkAffiliateStatsTransfer(
    @Payload() transfer: TransferInterface,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    this.affiliateService.checkStatsTransfer(transfer);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.createOne)
  async createOneEvent(
    @Payload() createAffiliateDto: AffiliateCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const affiliate = await this.affiliateService.newAffiliate(
      createAffiliateDto,
    );
    CommonService.ack(ctx);
    return affiliate;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.findOneById)
  async findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.affiliateService.getOne(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesAffiliateEnum.updateOne)
  async updateOneEvent(
    @Payload() updateAffiliateDto: AffiliateUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.affiliateService.updateAffiliate(updateAffiliateDto);
  }

  @AllowAnon()
  @EventPattern(EventsNamesAffiliateEnum.checkStats)
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  async checkStatsForAllAffiliateEvent(@Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.affiliateService.checkStatsForOneAffiliate();
  }

  @AllowAnon()
  @EventPattern(EventsNamesAffiliateEnum.checkStatsOneAffiliate)
  // @CheckPoliciesAbility(new PolicyHandlerAffiliateAll())
  async checkStatsForOneAffiliateEvent(
    @Payload() affiliateId: string,
    @Ctx() ctx: RmqContext,
  ) {
    Logger.debug(affiliateId, 'checkStatsForOneAffiliateEvent.affiliateId');
    CommonService.ack(ctx);
    return this.affiliateService.checkStatsForOneAffiliate(affiliateId);
  }
}
