import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  NotImplementedException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateLeadAffiliateDto } from '@affiliate/affiliate/domain/dto/create-lead-affiliate.dto';
import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { ApiKeyCheck } from '@auth/auth/decorators/api-key-check.decorator';
import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import ActionsEnum from '@common/common/enums/ActionEnum';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { LeadCreateDto } from '@lead/lead/dto/lead.create.dto';
import { LeadUpdateDto } from '@lead/lead/dto/lead.update.dto';
import { TransactionLeadCreateDto } from '@lead/lead/dto/transaction-lead.create.dto';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { ApiKeyAffiliateAuthGuard } from '../../../libs/auth/src/guards/api.key.affiliate.guard';
import { AutologinLeadDto } from './dto/autologin.lead.dto';
import { CftdToFtdDto } from './dto/cftd_to_ftd.dto';
import { LeadResponseDto } from './dto/lead.response.dto';
import { StatsLeadResponseDto } from './dto/lead.stats.response.dto';
import { LoginLeadDto } from './dto/login.lead.dto';
import { MoveLeadDto } from './dto/move_lead.dto';
import EventsNamesLeadEnum from './enum/events.names.lead.enum';
import { LeadServiceService } from './lead-service.service';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import { StatusInterface } from '@status/status/entities/status.interface';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import TagEnum from '@common/common/enums/TagEnum';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
import EventsNamesCrmEnum from 'apps/crm-service/src/enum/events.names.crm.enum';

@ApiTags('LEAD')
@Controller('lead')
export class LeadServiceController implements GenericServiceController {
  constructor(
    private readonly leadService: LeadServiceService,
    @Inject(`${EventClientEnum.LEAD}-CLIENT`)
    private readonly leadClient: ClientProxy,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
  ) {}

  @Post('create')
  @AllowAnon()
  @ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiResponse({
    status: 200,
    description: 'was created successfully',
    type: LeadResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.CREATE))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.CREATE))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.CREATE))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.CREATE))
  async addLeadAffiliate(@Body() createLeadDto: CreateLeadAffiliateDto) {
    return this.leadService.redirectAddLeadAffiliate(createLeadDto);
  }

  @Post('login')
  @AllowAnon()
  @ApiTags('Integration Lead')
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: LeadResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(401, ActionsEnum.LOGIN))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.LOGIN))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.LOGIN))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.LOGIN))
  async loginLeadAffiliate(@Body() loginData: LoginLeadDto, @Request() req) {
    loginData.apiKey =
      loginData.apiKey ?? req.headers['affico-360-affiliate-key'];
    const lead = await this.leadService.loginLead(loginData);
    if (!!lead) {
      return new LeadResponseDto(lead);
    }
    return new UnauthorizedException('Lead not authorized');
  }

  @ApiKeyCheck()
  @UseGuards(AuthGuard('api-key'))
  @Get('integration')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async findAllApiKey(
    @Query() query: QuerySearchAnyDto,
    @Request() req: Request,
  ) {
    query = query ?? {};
    query.relations = ['status', 'statusCrm', 'referralType', 'brand'];
    query.where = query.where ?? {};
    if (query.where.tpId) {
      query.where.crmIdLead = query.where.tpId;
      delete query.where.tpId;
    }
    if (query.where.status) {
      const listStatus = {
        ftd: 'dateFTD',
        cftd: 'dateCFTD',
        retention: 'dateRetention',
      };
      const name = CommonService.getSlug(query.where.status);
      if (listStatus[name]) {
        const attrName = listStatus[name];
        query.where[attrName] = {
          $exists: true,
        };
      }
      delete query.where.status;
    }
    query.where.integration = req['user']?._id;
    const rta = await this.leadService.getAll(query);
    return this.leadService.getPaginatorAffiliate(rta);
  }

  @Get()
  @ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: ResponsePaginator<LeadResponseDto>,
  })
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findAllLeadFromAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
  ) {
    return this.leadService.findAllLeadFromAffiliate(req, query);
  }

  @Get('/id/:leadID')
  @ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.SEARCH))
  async findOneIdFromAffiliate(
    @Request() req: Request,
    @Param('leadID') id: string,
  ) {
    return this.leadService.findAllLeadByIdFromAffiliate(req, id);
  }

  @Get('/tpId/:tpIdLead')
  //@ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.VIEW))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.VIEW))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.VIEW))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.VIEW))
  async findOneByTpIdFromAffiliate(
    @Request() req: Request,
    @Param('tpIdLead') tpId: string,
  ) {
    return this.leadService.findAllLeadByTpIdFromAffiliate(req, tpId);
  }

  @Get('/referral/:referral')
  //@ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: ResponsePaginator<LeadResponseDto>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.SEARCH))
  async findAllByReferralAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('referral') referral: string,
  ) {
    if (!referral) {
      throw new NotFoundException('Need the referral to search');
    }
    return this.leadService.findAllLeadByReferralFromAffiliate(
      req,
      query,
      referral,
    );
  }

  @Get('/referral-type/:referralTypeShortName')
  //@ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.SEARCH))
  async findAllByReferralTypeAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('referralTypeShortName') referralTypeShortName: string,
  ) {
    /* if (!referralTypeShortName) {
      throw new NotFoundException('Need the referral type to search');
    } */
    return this.leadService.findAllLeadByReferralTypeFromAffiliate(
      req,
      query,
      referralTypeShortName,
    );
  }

  @Get('/country/:countryCode')
  //@ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadResponseDto,
  })
  /* @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.SEARCH)) */
  async findAllByCountryAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('countryCode') countryCode: string,
  ) {
    if (!countryCode) {
      throw new NotFoundException('Need the countryCode to search');
    }
    return this.leadService.findAllLeadByCountryFromAffiliate(
      req,
      query,
      countryCode,
    );
  }

  @Get('/stats/:tpId')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: StatsLeadResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.SEARCH))
  async statsTransferLeadByAffiliate(
    @Request() req: Request,
    @Param('tpId') tpId: string,
  ) {
    if (!tpId) {
      throw new NotFoundException('Need the tpId to search');
    }
    return this.leadService.statsTransferLeadByAffiliate(req, tpId);
  }

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(403, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(404, ActionsEnum.SEARCH))
  @ApiResponse(ResponseAffico.getResponseSwagger(500, ActionsEnum.SEARCH))
  async findAll(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    if (query?.where?.createdAt) {
      // TODO[hender - 2024/03/11] Assume the createdAt is the createdAt, CFTD or FTD date
      query.where.$or = [];
      query.where.$or.push({
        createdAt: query.where.createdAt,
      });
      query.where.$or.push({
        dateCFTD: query.where.createdAt,
      });
      query.where.$or.push({
        dateFTD: query.where.createdAt,
      });
      delete query.where.createdAt;
    }
    return this.leadService.getAll(query);
  }

  @Get('filter-new')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully new leads',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findNew(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getNew(query);
  }

  @Get('database')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully database leads',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findDatabase(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getDatabase(query);
  }

  @Get('transfer-ftd')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully FTD leads',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findTransferFtd(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getTransferFtd(query);
  }

  @Get('transfer-ftd-date')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully FTD leads today',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findTransferFtdDate(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getTransferFtdDate(query);
  }

  @Get('force-partial-ftd')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully FTD leads today',
    type: LeadEntity,
  })
  async forcePartialFtd(@Query() query: QuerySearchAnyDto, @Req() req?) {
    let page = 1;
    let totalPages = 0;
    do {
      const leads = await this.leadService.findAll({
        page: page,
        relations: ['transfers'],
        where: {
          /* createdAt: {
            $gte: new Date('2024-05-15T00:00:00.000+00:00'),
          }, */
          transfers: { $not: { $size: 0 } },
          partialFtdDate: { $exists: false },
        },
      });
      const inactive = await this.builder.getPromiseStatusEventClient(
        EventsNamesStatusEnum.findOneByName,
        'inactive',
      );
      for (const lead of leads.list) {
        const firstTransferPayed = lead.transfers.filter((transfer) => {
          return transfer.hasApproved;
        })[0];
        if (
          firstTransferPayed &&
          firstTransferPayed?.status?._id.toString() != inactive?._id
        ) {
          Logger.log(
            `Updated ${lead.email}-${firstTransferPayed.numericId} partial FTD`,
          );
          this.builder.emitLeadEventClient(EventsNamesLeadEnum.updateOne, {
            id: lead._id,
            partialFtdAmount: firstTransferPayed.amount,
            partialFtdDate:
              firstTransferPayed.confirmedAt ?? firstTransferPayed.approvedAt,
          });
        } else {
          this.builder.emitLeadEventClient(EventsNamesLeadEnum.updateOne, {
            id: lead._id,
            partialFtdAmount: 0,
            partialFtdDate: null,
          });
        }
      }
      if (leads.nextPage != 1) {
        totalPages = page;
      }
      Logger.log(`Updated ${page} page of ${leads.lastPage}`);
      page = leads.nextPage;
    } while (page != 1);
    return {
      code: 200,
      msg: `Check ${totalPages} pages`,
    };
  }

  @Get('update-list-transfers-lead')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async updateListTransfersLead(
    @Query() query: QuerySearchAnyDto,
    @Req() req?,
  ) {
    let pageLeads = 1;
    const leadsUpdated = [];
    do {
      const leads = await this.leadService.findAll({
        where: query ?? {},
        page: pageLeads,
      });
      Logger.debug(
        `Page ${pageLeads} / ${leads.lastPage}`,
        'Check stats affiliate lead email',
      );
      pageLeads = leads.nextPage;
      for (const lead of leads.list) {
        let pageTransfers = 1;
        do {
          const listTransfers =
            await this.builder.getPromiseTransferEventClient(
              EventsNamesTransferEnum.findAll,
              {
                page: pageTransfers++,
                where: {
                  lead: lead._id,
                },
              },
            );
          pageTransfers = listTransfers.nextPage;
          const leadToUpdate = {
            id: lead._id,
            transfers: listTransfers.list,
            quantityTransfer: listTransfers.list.length,
            totalTransfer:
              listTransfers.list.length &&
              listTransfers.list.reduce((a, b) => {
                return a.amount + b.amount;
              }),
            totalPayed:
              listTransfers.list.length &&
              listTransfers.list.reduce((a, b) => {
                let tmp = 0;
                if (a.hasApproved) {
                  tmp += a.amount;
                }
                if (b.hasApproved) {
                  tmp += b.amount;
                }
                return tmp;
              }),
          };
          if (leadToUpdate.totalPayed.amount) {
            leadToUpdate.totalPayed = leadToUpdate.totalPayed.amount;
          }
          if (leadToUpdate.totalTransfer.amount) {
            leadToUpdate.totalTransfer = leadToUpdate.totalTransfer.amount;
          }
          leadsUpdated.push(lead.email);
          this.builder.emitLeadEventClient(
            EventsNamesLeadEnum.updateOne,
            leadToUpdate,
          );
        } while (pageTransfers != 1);
      }
    } while (pageLeads != 1);
    return leadsUpdated;
  }

  @Get('transfer-ftd-late')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully FTD leads late',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findTransferFtdLate(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getTransferFtdLate(query);
  }

  @Get('cftd-transfer-ftd')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully cftd & ftd leads',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findCftdTransferFtd(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getCftdTransferFtd(query);
  }

  @Get('retention')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully retention leads',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findRetention(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getRetention(query);
  }

  @Get('cftd')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully cftd leads',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findCftd(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getCftd(query);
  }

  @Get('moved')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async listMovedLead(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getAllMovedLeads(query);
  }

  @Get('new')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async listNewLead(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getAllActiveLeads(query, true);
  }

  @Get('inactive')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async listInactiveLead(@Query() query: QuerySearchAnyDto, @Req() req?) {
    throw new NotImplementedException();
    /* query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getAllActiveLeads(query, false); */
  }

  @Get('active')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async listActiveLead(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.listNewLead(query);
  }
  @Get('send-to-crm')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async sendToCrm(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    query.relations = ['affiliate'];
    const leads = await this.leadService.getAll(query);
    const rta = {};
    for (const lead of leads.list) {
      rta[lead.email] = await this.builder.getPromiseCrmEventClient(
        EventsNamesCrmEnum.createOneLeadOnCrm,
        {
          secretKey: lead.affiliate.publicKey,
          leadDto: lead,
        },
      );
    }
    return {
      code: 201,
      data: rta,
    };
  }

  @Get('send-to-crm-without-tpid')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async sendToCrmWithoutTpId(@Query() query: QuerySearchAnyDto, @Req() req?) {
    //query = await this.filterFromUserPermissions(query, req);
    let isSuperadmin = false;
    for (const permission of req.user.permissions) {
      if (permission.action === ActionsEnum.MANAGE) {
        isSuperadmin = true;
        break;
      }
    }
    if (isSuperadmin) {
      throw new NotImplementedException();
    }
    query = query ?? {};
    query.relations = ['affiliate'];
    query.where = query.where ?? {
      crmIdLead: {
        $exists: false,
      },
    };
    const leads = await this.leadService.getAll(query);
    const rta = {
      checked: 0,
      total: leads.elementsPerPage,
      pages: leads.lastPage,
    };
    for (const lead of leads.list) {
      if (!rta[lead.email]) {
        rta.checked++;
        rta[lead.email] = await this.builder.getPromiseCrmEventClient(
          EventsNamesCrmEnum.createOneLeadOnCrm,
          {
            secretKey: lead.affiliate.publicKey,
            leadDto: lead,
          },
        );
      }
    }
    return {
      code: 201,
      data: rta,
    };
  }

  @Get('byTpId/:tpId')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async findOneByTpId(
    @Param('tpId') tpId: any,
    @Query() query: QuerySearchAnyDto,
    @Req() req?,
  ) {
    query = await this.filterFromUserPermissions(query, req);
    return this.leadService.getOneByTpId(tpId, query.relations);
  }

  @Get(':leadID')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: LeadEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findOneById(@Param('leadID') id: string) {
    return this.leadService.getOne(id);
  }

  @Post('transfer')
  // @CheckPoliciesAbility(new PolicyHandlerLeadCreateTransfer())
  @ApiResponse({
    status: 200,
    description: 'was successfully transaction created',
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createTransfer(
    @Body() createTransactionLeadDto: TransactionLeadCreateDto,
  ) {
    throw new NotImplementedException();
    /* const transaction = await this.leadService.createTransaction(
      createTransactionLeadDto,
    );
    return {
      transactionId: transaction.id,
    }; */
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerLeadCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: LeadCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createOne(@Body() createLeadDto: LeadCreateDto) {
    return this.leadService.newLead(createLeadDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerLeadCreate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: LeadCreateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async createMany(
    @Body(new ParseArrayPipe({ items: LeadCreateDto }))
    createLeadsDto: LeadCreateDto[],
  ) {
    return this.leadService.newManyLead(createLeadsDto);
  }

  @Post('move')
  // @CheckPoliciesAbility(new PolicyHandlerLeadMove())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async moveLead(
    @Body(new ParseArrayPipe({ items: MoveLeadDto }))
    moveLeadsDto: MoveLeadDto[],
  ) {
    return this.leadService.moveLead(moveLeadsDto);
  }

  @Post('autologin')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'was successfully login lead',
  })
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiTags('Affiliate Lead')
  @ApiTags('Integration Lead')
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async autologinLeadAffiilate(
    @Request() req: Request,
    @Body()
    autoLoginLeadDto: AutologinLeadDto,
  ) {
    const rta = await this.leadService.autologinLead(
      autoLoginLeadDto,
      req['affiliate'],
    );
    return {
      statusCode: 200,
      data: rta,
    };
  }

  @Patch('cftd-to-ftd')
  // @CheckPoliciesAbility(new PolicyHandlerLeadSet())
  @ApiResponse({
    status: 200,
    description: 'was successfully updated',
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async cftdToFtd(
    @Body(new ParseArrayPipe({ items: CftdToFtdDto }))
    cftdToFtdDto: CftdToFtdDto[],
  ) {
    return this.leadService.cftdToFtd(cftdToFtdDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerLeadUpdate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: LeadUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async updateOne(@Body() updateLeadDto: LeadUpdateDto) {
    return this.updateOneEventClient(updateLeadDto, null);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerLeadUpdate())
  @ApiResponse({
    status: 201,
    description: 'was successfully created',
    type: LeadUpdateDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async updateMany(
    @Body(new ParseArrayPipe({ items: LeadUpdateDto }))
    updateLeadsDto: LeadUpdateDto[],
  ) {
    return this.leadService.updateManyLeads(updateLeadsDto);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerLeadDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: LeadUpdateDto }))
    ids: LeadUpdateDto[],
  ) {
    return this.leadService.deleteManyLeads(
      ids.map((lead) => lead.id.toString()),
    );
  }

  @Delete(':leadID')
  // @CheckPoliciesAbility(new PolicyHandlerLeadDelete())
  async deleteOneById(@Param('leadID') id: string) {
    return this.leadService.deleteLead(id);
  }

  @Get('transfers/:leadID')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async checkTransfersByLead(@Param('leadID') id: string) {
    return this.leadService.checkTransfersLead(id);
  }

  @Get('check-status/:leadID')
  // @CheckPoliciesAbility(new PolicyHandlerLeadRead())
  async checkStatusByLead(@Param('leadID') id: string) {
    //return this.leadService.checkOneTransferLead(id);
    throw new NotImplementedException();
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.addLeadFromAffiliate)
  async addLeadAffiliateEvent(
    @Payload() createLeadDto: CreateLeadAffiliateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    try {
      const lead = await this.leadService.createLeadFromAffiliate(
        createLeadDto.secretKey,
        createLeadDto,
        ctx,
      );
      const leadRta = new LeadResponseDto(lead);
      return leadRta;
    } catch (err) {
      return err;
    }
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.findOneById)
  async findOneEvent(
    @Payload() leadId: string,
    @Ctx() ctx: RmqContext,
  ): Promise<LeadDocument> {
    CommonService.ack(ctx);
    return this.leadService.getOne(leadId);
  }

  //Todo[hender-30-01-2024] Add to endpoint list
  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.getAffiliatesFromLeads)
  async getAffiliatesFromLeads(
    @Payload() leads: Array<string>,
    @Ctx() ctx: RmqContext,
  ): Promise<LeadDocument> {
    CommonService.ack(ctx);
    return this.leadService.getAffiliatesFromLeads(leads);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.findOneByTpId)
  async findOneEventByTpId(
    @Payload() tpId: string,
    @Ctx() ctx: RmqContext,
  ): Promise<LeadDocument> {
    CommonService.ack(ctx);
    return this.leadService.getOneByTpId(tpId);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.createMany)
  async createManyEvent(
    @Payload() createLeadsDto: LeadCreateDto[],
    @Ctx() ctx: RmqContext,
  ): Promise<LeadDocument[]> {
    const lead = this.createMany(createLeadsDto);
    CommonService.ack(ctx);
    return lead;
  }

  @AllowAnon()
  @EventPattern(EventsNamesLeadEnum.updateOne)
  @MessagePattern(EventsNamesLeadEnum.updateOne)
  async updateOneEventClient(
    @Payload() updateLeadDto: LeadUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.leadService.updateLead(updateLeadDto);
  }

  @AllowAnon()
  @EventPattern(EventsNamesLeadEnum.checkLeadsCreatedInCrm)
  async checkLeadsCreatedInCrm(
    @Payload() source: JSON,
    @Ctx() ctx: RmqContext,
  ) {
    const leadsWithoutTpId = await this.leadService.getAll({
      where: {
        crmIdLead: {
          $eq: null,
        },
      },
    });
    for (const lead of leadsWithoutTpId.list) {
      Logger.log(`Checked ${lead.email}`, LeadServiceController.name);
    }
    CommonService.ack(ctx);
    Logger.log(leadsWithoutTpId.totalElements, LeadServiceController.name);
  }

  @AllowAnon()
  @EventPattern(EventsNamesLeadEnum.checkLeadsForAffiliateStats)
  async checkAllLeadsForAffiliateStats(
    @Payload() affiliateId: string,
    @Ctx() ctx: RmqContext,
  ) {
    await this.leadService.checkAllLeadsForAffiliateStats(affiliateId);
    CommonService.ack(ctx);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.createOne)
  createOneEvent(@Payload() createDto: LeadCreateDto, @Ctx() ctx: RmqContext) {
    const lead = this.createOne(createDto);
    CommonService.ack(ctx);
    return lead;
  }

  /* @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.updateOne) */
  updateOneEvent(@Payload() updateDto: LeadUpdateDto, @Ctx() ctx: RmqContext) {
    const lead = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return lead;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.updateOneByTpId)
  @EventPattern(EventsNamesLeadEnum.updateOneByTpId)
  async updateOneByTpId(
    @Payload() updateDto: LeadUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    if (!updateDto.crmIdLead) {
      throw new BadRequestException('Not found TpId');
    }
    const tmp = await this.findOneByTpId(updateDto.crmIdLead, {});
    if (!tmp) {
      throw new BadRequestException('Not found Lead');
    }
    updateDto.id = tmp.id;
    const lead = await this.updateOne(updateDto);
    return lead;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: LeadUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const lead = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return lead;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const lead = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return lead;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesLeadEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const lead = this.deleteOneById(id);
    CommonService.ack(ctx);
    return lead;
  }

  @AllowAnon()
  @EventPattern(EventsNamesLeadEnum.checkLeadsStatusInCrm)
  async checkAllStatusLeadsInCrm(
    @Payload() payload: Array<string>,
    @Ctx() ctx: RmqContext,
  ) {
    await this.leadService.checkAllStatusLeadsInCrm(payload);
    CommonService.ack(ctx);
  }

  private async filterFromUserPermissions(
    query: QuerySearchAnyDto,
    req,
  ): Promise<QuerySearchAnyDto> {
    const user = req?.user;
    if (user) {
      query.where = query.where ?? {};
      const psps = [];
      const crms = [];
      const brands = [];
      const affiliates = [];
      let isSuperadmin = false;
      for (const permission of user.permissions) {
        if (permission.action === ActionsEnum.MANAGE) {
          isSuperadmin = true;
          break;
        }
        if (permission.scope) {
          if (permission.scope.resourceName === ResourcesEnum.BUSINESS_UNIT) {
            brands.push(permission.scope.resourceId);
          } else if (permission.scope.resourceName === ResourcesEnum.CRM) {
            crms.push(permission.scope.resourceId);
          } else if (permission.scope.resourceName === ResourcesEnum.PSP) {
            psps.push(permission.scope.resourceId);
          } else if (
            permission.scope.resourceName === ResourcesEnum.AFFILIATE
          ) {
            affiliates.push(permission.scope.resourceId);
          }
        }
      }
      /* if (!isSuperadmin) {
        query.where.$or = [];
        if (brands.length) {
          query.where.$or.push({
            brand: {
              $in: brands,
            },
          });
        }
        if (psps.length) {
          query.where.$or.push({
            psps: {
              $in: psps,
            },
          });
        }
        if (crms.length) {
          query.where.$or.push({
            crm: {
              $in: crms,
            },
          });
        }
        if (affiliates.length) {
          query.where.$or.push({
            affiliate: {
              $in: affiliates,
            },
          });
        }
      } */
      if (!isSuperadmin) {
        if (brands.length) {
          query.where.brand = {
            $in: brands,
          };
        }
        if (psps.length) {
          query.where.psps = {
            $in: psps,
          };
        }
        if (crms.length) {
          query.where.crm = {
            $in: crms,
          };
        }
        if (affiliates.length) {
          query.where.affiliate = {
            $in: affiliates,
          };
        }
      }
      if (req.user?.userParent) {
        //TODO[hender - 14/02/2024] If userParent,search only data of affiliates with userParent as user
        const affiliates = await this.builder.getPromiseAffiliateEventClient(
          EventsNamesAffiliateEnum.findAll,
          {
            take: 100000,
            where: {
              user: req.user?.userParent,
            },
          },
        );
        query.where.affiliate = {
          $in: affiliates.list.map((affiliate) => affiliate._id),
        };
      }
    }
    return query;
  }
}
