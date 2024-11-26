import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { ApiKeyCheck } from '@auth/auth/decorators/api-key-check.decorator';
import { ApiKeyAffiliateAuthGuard } from '@auth/auth/guards/api.key.affiliate.guard';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { PolicyHandlerTransferCreate } from '@auth/auth/policy/transfer/policity.handler.transfer.create';
import { PolicyHandlerTransferDelete } from '@auth/auth/policy/transfer/policity.handler.transfer.delete';
import { PolicyHandlerTransferRead } from '@auth/auth/policy/transfer/policity.handler.transfer.read';
import { PolicyHandlerTransferUpdate } from '@auth/auth/policy/transfer/policity.handler.transfer.update';
import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PspAccountInterface } from '@psp-account/psp-account/entities/psp-account.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { StatsDatePspAccountDocument } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { TransferCreateDto } from '@transfer/transfer/dto/transfer.create.dto';
import { TransferUpdateDepositDto } from '@transfer/transfer/dto/transfer.update.deposit.dto';
import { TransferUpdateDto } from '@transfer/transfer/dto/transfer.update.dto';
import { TransferUpdateWithdrawalDto } from '@transfer/transfer/dto/transfer.update.withdrawal.dto';
import { TransferDocument } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import EventsNamesPspAccountEnum from 'apps/psp-service/src/enum/events.names.psp.acount.enum';
import EventsNamesStatsEnum from 'apps/stats-service/src/enum/events.names.stats.enum';
import { ApproveOrRejectDepositDto } from '../../../libs/transfer/src/dto/approve.or.reject.deposit.dto';
import { TransferAffiliateResponseDto } from './dto/transfer.affiliate.response.dto';
import EventsNamesTransferEnum from './enum/events.names.transfer.enum';
import { TransferServiceService } from './transfer-service.service';
import { TransferUpdateFromLatamCashierDto } from '@transfer/transfer/dto/transfer.update.from.latamcashier.dto';
import { isMongoId } from 'class-validator';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';

@ApiTags('TRANSFER')
@Controller('transfer')
export class TransferServiceController implements GenericServiceController {
  constructor(
    private readonly transferService: TransferServiceService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
  ) {}

  @Get('searchText')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async searchText(@Query() query: QuerySearchAnyDto, @Req() req?) {
    //query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getSearchText(query);
  }
  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findAll(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getAll(query);
  }

  @Get('deposit')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findDeposit(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.operationType = OperationTransactionType.deposit;
    query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getAll(query);
  }

  @Get('credit')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findCredit(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.operationType = OperationTransactionType.credit;
    query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getAll(query);
  }

  @Get('withdrawal')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findWithdrawal(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.operationType = OperationTransactionType.withdrawal;
    query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getAll(query);
  }

  @Get('debit')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findDebit(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.operationType = OperationTransactionType.debit;
    query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getAll(query);
  }

  @Get('chargeback')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findChargeBack(@Query() query: QuerySearchAnyDto, @Req() req?) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.operationType = OperationTransactionType.chargeback;
    query = await this.filterFromUserPermissions(query, req);
    return this.transferService.getAll(query);
  }

  @Get('check-numeric-id')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async checkNumericId() {
    throw new NotFoundException('Not found numeric id');
    //return this.transferService.checkNumericId();
  }

  @Get('deposit/from-page')
  @ApiKeyCheck()
  @ApiTags('Integration Lead')
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: ResponsePaginator<TransferAffiliateResponseDto>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findDepositFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.affiliate = await this.transferService.getAffiliateIsAdmin(
      req['affiliate'],
    );
    if (query.where.tpId) {
      query.where.leadTpId = query.where.tpId;
      delete query.where.tpId;
    }
    query.where.operationType = OperationTransactionType.deposit;
    query.relations = [
      'psp',
      'status',
      'bank',
      'department',
      'typeTransaction',
      'pspAccount',
    ];
    return this.getTransferToAffiliate(
      await this.transferService.getAll(query),
    );
  }

  @Get('withdrawal/from-page')
  @ApiKeyCheck()
  @ApiTags('Integration Lead')
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: ResponsePaginator<TransferAffiliateResponseDto>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findWithdrawalFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.affiliate = await this.transferService.getAffiliateIsAdmin(
      req['affiliate'],
    );
    if (query.where.tpId) {
      query.where.leadTpId = query.where.tpId;
      delete query.where.tpId;
    }
    query.where.operationType = OperationTransactionType.withdrawal;
    query.relations = [
      'psp',
      'status',
      'bank',
      'department',
      'typeTransaction',
      'pspAccount',
    ];
    return this.getTransferToAffiliate(
      await this.transferService.getAll(query),
    );
  }

  @Get('credit/from-page')
  @ApiKeyCheck()
  @ApiTags('Integration Lead')
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: ResponsePaginator<TransferAffiliateResponseDto>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findCreditFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.affiliate = await this.transferService.getAffiliateIsAdmin(
      req['affiliate'],
    );
    if (query.where.tpId) {
      query.where.leadTpId = query.where.tpId;
      delete query.where.tpId;
    }
    query.where.operationType = OperationTransactionType.credit;
    query.relations = [
      'psp',
      'status',
      'bank',
      'department',
      'typeTransaction',
      'pspAccount',
    ];
    return this.getTransferToAffiliate(
      await this.transferService.getAll(query),
    );
  }

  @Get('debit/from-page')
  @ApiKeyCheck()
  @ApiTags('Integration Lead')
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: ResponsePaginator<TransferAffiliateResponseDto>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findDebitFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.affiliate = await this.transferService.getAffiliateIsAdmin(
      req['affiliate'],
    );
    if (query.where.tpId) {
      query.where.leadTpId = query.where.tpId;
      delete query.where.tpId;
    }
    query.where.operationType = OperationTransactionType.debit;
    query.relations = [
      'psp',
      'status',
      'bank',
      'department',
      'typeTransaction',
      'pspAccount',
    ];
    return this.getTransferToAffiliate(
      await this.transferService.getAll(query),
    );
  }

  @Get('chargeback/from-page')
  @ApiKeyCheck()
  @ApiTags('Integration Lead')
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 200,
    description: 'was searched successfully',
    type: ResponsePaginator<TransferAffiliateResponseDto>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findChargebackFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where.affiliate = await this.transferService.getAffiliateIsAdmin(
      req['affiliate'],
    );
    if (query.where.tpId) {
      query.where.leadTpId = query.where.tpId;
      delete query.where.tpId;
    }
    query.where.operationType = OperationTransactionType.chargeback;
    query.relations = [
      'psp',
      'status',
      'bank',
      'department',
      'typeTransaction',
      'pspAccount',
    ];
    return this.getTransferToAffiliate(
      await this.transferService.getAll(query),
    );
  }

  @Get('deposit/from-page/:transferId')
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
    type: ResponsePaginator<TransferEntity>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findDepositOneFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('idPayment') idPayment: string,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where._id = idPayment;
    query.where.operationType = OperationTransactionType.deposit;
    return this.findDepositFromPageAffiliate(req, query);
  }

  @Get('withdrawal/from-page/:transferId')
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
    type: ResponsePaginator<TransferEntity>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findWithdrawalOneFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('idPayment') idPayment: string,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where._id = idPayment;
    query.where.operationType = OperationTransactionType.withdrawal;
    return this.findWithdrawalFromPageAffiliate(req, query);
  }

  @Get('credit/from-page/:transferId')
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
    type: ResponsePaginator<TransferEntity>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findCreditOneFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('idPayment') idPayment: string,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where._id = idPayment;
    query.where.operationType = OperationTransactionType.credit;
    return this.findDepositFromPageAffiliate(req, query);
  }

  @Get('debit/from-page/:transferId')
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
    type: ResponsePaginator<TransferEntity>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findDebitOneFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('idPayment') idPayment: string,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where._id = idPayment;
    query.where.operationType = OperationTransactionType.debit;
    return this.findWithdrawalFromPageAffiliate(req, query);
  }

  @Get('chargeback/from-page/:transferId')
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
    type: ResponsePaginator<TransferEntity>,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async findChargebackOneFromPageAffiliate(
    @Request() req: Request,
    @Query() query: QuerySearchAnyDto,
    @Param('idPayment') idPayment: string,
  ) {
    query = query ?? new QuerySearchAnyDto();
    query.where = query.where ?? {};
    query.where._id = idPayment;
    query.where.operationType = OperationTransactionType.chargeback;
    query = await this.filterFromUserPermissions(query, req);
    return this.findWithdrawalFromPageAffiliate(req, query);
  }

  @Post('deposit/from-page')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: TransferAffiliateResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async createDepositOneFromPageAffiliate(
    @Request() req: Request,
    @Body() createTransferDto: TransferCreateDto,
  ) {
    const transfer = await this.transferService.newDepositFromAffiliate(
      createTransferDto,
      req['affiliate'],
    );
    return new TransferAffiliateResponseDto(transfer);
  }

  @Post('withdrawal/from-page')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: TransferAffiliateResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async createWithdrawalOneFromPageAffiliate(
    @Request() req: Request,
    @Body() createTransferDto: TransferCreateDto,
  ) {
    const transfer = await this.transferService.newWithdrawalFromAffiliate(
      createTransferDto,
      req['affiliate'],
    );
    return new TransferAffiliateResponseDto(transfer);
  }

  @Post('credit/from-page')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: TransferAffiliateResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async createCreditOneFromPageAffiliate(
    @Request() req: Request,
    @Body() createTransferDto: TransferCreateDto,
  ) {
    const transfer = await this.transferService.newCreditFromAffiliate(
      createTransferDto,
      req['affiliate'],
    );
    return new TransferAffiliateResponseDto(transfer);
  }

  @Post('debit/from-page')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: TransferAffiliateResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async createDebitOneFromPageAffiliate(
    @Request() req: Request,
    @Body() createTransferDto: TransferCreateDto,
  ) {
    const transfer = await this.transferService.newDebitFromAffiliate(
      createTransferDto,
      req['affiliate'],
    );
    return new TransferAffiliateResponseDto(transfer);
  }

  @Post('chargeback/from-page')
  @ApiTags('Integration Lead')
  @ApiKeyCheck()
  @UseGuards(ApiKeyAffiliateAuthGuard)
  @ApiHeader({
    name: 'affico-360-affiliate-key',
    description: 'The affiliate secret key',
  })
  @ApiResponse({
    status: 201,
    description: 'was searched successfully',
    type: TransferAffiliateResponseDto,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async createChargebackOneFromPageAffiliate(
    @Request() req: Request,
    @Body() createTransferDto: TransferCreateDto,
  ) {
    const transfer = await this.transferService.newChargebackFromAffiliate(
      createTransferDto,
      req['affiliate'],
    );
    return new TransferAffiliateResponseDto(transfer);
  }

  @Patch('deposit/from-page')
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
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async updateDepositOneFromPageAffiliate(
    @Request() req: Request,
    @Body() updatePaymentTransferDto: TransferUpdateDepositDto,
  ) {
    return this.updateOperationTypeOneFromPageAffiliate(
      req,
      updatePaymentTransferDto,
      OperationTransactionType.deposit,
    );
  }

  @Patch('withdrawal/from-page')
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
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async updateWithdrawalOneFromPageAffiliate(
    @Request() req: Request,
    @Body() updatePaymentTransferDto: TransferUpdateWithdrawalDto,
  ) {
    return this.updateOperationTypeOneFromPageAffiliate(
      req,
      updatePaymentTransferDto,
      OperationTransactionType.withdrawal,
    );
  }

  @Patch('credit/from-page')
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
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async updateCreditOneFromPageAffiliate(
    @Request() req: Request,
    @Body() updatePaymentTransferDto: TransferUpdateDepositDto,
  ) {
    return this.updateOperationTypeOneFromPageAffiliate(
      req,
      updatePaymentTransferDto,
      OperationTransactionType.credit,
    );
  }
  @Patch('debit/from-page')
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
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async updateDebitOneFromPageAffiliate(
    @Request() req: Request,
    @Body() updatePaymentTransferDto: TransferUpdateWithdrawalDto,
  ) {
    return this.updateOperationTypeOneFromPageAffiliate(
      req,
      updatePaymentTransferDto,
      OperationTransactionType.debit,
    );
  }
  @Patch('chargeback/from-page')
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
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async updateChargebackOneFromPageAffiliate(
    @Request() req: Request,
    @Body() updatePaymentTransferDto: TransferUpdateWithdrawalDto,
  ) {
    return this.updateOperationTypeOneFromPageAffiliate(
      req,
      updatePaymentTransferDto,
      OperationTransactionType.chargeback,
    );
  }

  @Get('deposit/:transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findOneDeposit(@Param('transferID') id: string) {
    const deposit = await this.transferService.getOne(id);
    if (deposit && deposit.operationType === OperationTransactionType.deposit) {
      return deposit;
    }
    throw new NotFoundException(`Not found deposit "${id}"`);
  }

  @Get('credit/:transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findOneCredit(@Param('transferID') id: string) {
    const credit = await this.transferService.getOne(id);
    if (credit && credit.operationType === OperationTransactionType.credit) {
      return credit;
    }
    throw new NotFoundException(`Not found credit "${id}"`);
  }

  @Get('withdrawal/:transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findOneWithdrawal(@Param('transferID') id: string) {
    const withdrawal = await this.transferService.getOne(id);
    if (
      withdrawal &&
      withdrawal.operationType === OperationTransactionType.withdrawal
    ) {
      return withdrawal;
    }
    throw new NotFoundException(`Not found withdrawal "${id}"`);
  }

  @Get('debit/:transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findOneDebit(@Param('transferID') id: string) {
    const debit = await this.transferService.getOne(id);
    if (debit && debit.operationType === OperationTransactionType.debit) {
      return debit;
    }
    throw new NotFoundException(`Not found debit "${id}"`);
  }

  @Get('chargeback/:transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findOneChargeback(@Param('transferID') id: string) {
    const chargeback = await this.transferService.getOne(id);
    if (
      chargeback &&
      chargeback.operationType === OperationTransactionType.chargeback
    ) {
      return chargeback;
    }
    throw new NotFoundException(`Not found chargeback "${id}"`);
  }

  // TODO[hender - 30-01-2024] Add to endpoint list
  @Get('check-status')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async checkStatus() {
    //return this.transferService.checkTransferInCashierByStatus();
    const sended = this.transferService.checkTransferInCashierSended();
    const pending = this.transferService.checkTransferInCashierPending();
    return Promise.all([sended, pending]);
  }

  @Get(':transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferRead())
  async findOneById(@Param('transferID') id: string) {
    return this.transferService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createOne(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ) {
    createTransferDto.userCreator = req?.user?.id;
    if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
      createTransferDto.userApprover = req?.user?.id;
    }
    return this.transferService.newTransfer(createTransferDto);
  }
  @Post('deposit')
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createOneDeposit(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ) {
    createTransferDto.userCreator = req?.user?.id;
    if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
      createTransferDto.userApprover = req?.user?.id;
    }
    createTransferDto.operationType = OperationTransactionType.deposit;
    return this.transferService.newTransfer(createTransferDto);
  }
  @Post('credit')
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createOneCredit(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ) {
    createTransferDto.userCreator = req?.user?.id;
    if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
      createTransferDto.userApprover = req?.user?.id;
    }
    createTransferDto.operationType = OperationTransactionType.credit;
    return this.transferService.newTransfer(createTransferDto);
  }
  @Post('withdrawal')
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createOneWithdrawal(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ) {
    createTransferDto.userCreator = req?.user?.id;
    if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
      createTransferDto.userApprover = req?.user?.id;
    }
    createTransferDto.operationType = OperationTransactionType.withdrawal;
    return this.transferService.newTransfer(createTransferDto);
  }
  @Post('debit')
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createOneDebit(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ) {
    createTransferDto.userCreator = req?.user?.id;
    if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
      createTransferDto.userApprover = req?.user?.id;
    }
    createTransferDto.operationType = OperationTransactionType.debit;
    return this.transferService.newTransfer(createTransferDto);
  }
  @Post('chargeback')
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createOneChargeback(
    @Body() createTransferDto: TransferCreateDto,
    @Request() req,
  ) {
    createTransferDto.userCreator = req?.user?.id;
    if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
      createTransferDto.userApprover = req?.user?.id;
    }
    createTransferDto.operationType = OperationTransactionType.chargeback;
    return this.transferService.newTransfer(createTransferDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerTransferCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: TransferCreateDto }))
    createTransfersDto: TransferCreateDto[],
    @Request() req,
  ) {
    for (const createTransferDto of createTransfersDto) {
      createTransferDto.userCreator = req?.user?.id;
      if (createTransferDto.hasApproved || createTransferDto.isManualTx) {
        createTransferDto.userApprover = req?.user?.id;
      }
    }
    return this.transferService.newManyTransfer(createTransfersDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerTransferUpdate())
  async updateOne(@Body() updateTransferDto: TransferUpdateDto) {
    return this.transferService.updateTransfer(updateTransferDto);
  }

  @Post('latam-cashier')
  // @CheckPoliciesAbility(new PolicyHandlerTransferUpdate())
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
    type: TransferEntity,
  })
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  @ApiResponse(ResponseAffico.getResponseSwagger(404))
  @ApiResponse(ResponseAffico.getResponseSwagger(500))
  async updateFromLatamCashier(
    @Body() updateTransferDto: TransferUpdateFromLatamCashierDto,
  ) {
    return this.transferService.updateTransferFromLatamCashier(
      updateTransferDto,
    );
  }

  @Patch('approve')
  // @CheckPoliciesAbility(new PolicyHandlerTransferUpdate())
  async approveOne(
    @Body() approveOrRejectTransferDto: ApproveOrRejectDepositDto,
    @Request() req,
  ) {
    approveOrRejectTransferDto.userApprover = req?.user?.id;
    return this.transferService.approveTransfer(approveOrRejectTransferDto);
  }

  @Patch('send-to-crm')
  // @CheckPoliciesAbility(new PolicyHandlerTransferUpdate())
  async sendToCrm(
    @Body() approveOrRejectTransferDto: ApproveOrRejectDepositDto,
  ) {
    // TODO[hender - 15/feb/2024] Add to routes mapping
    return this.transferService.sendToCrm(approveOrRejectTransferDto);
  }

  @Patch('reject')
  // @CheckPoliciesAbility(new PolicyHandlerTransferUpdate())
  async rejectOne(
    @Body() approveOrRejectTransferDto: ApproveOrRejectDepositDto,
    @Request() req,
  ) {
    approveOrRejectTransferDto.userRejecter = req?.user?.id;
    return this.transferService.rejectTransfer(approveOrRejectTransferDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerTransferUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: TransferUpdateDto }))
    updateTransfersDto: TransferUpdateDto[],
  ) {
    return this.transferService.updateManyTransfer(updateTransfersDto);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerTransferDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: TransferUpdateDto }))
    ids: TransferUpdateDto[],
  ) {
    return this.transferService.deleteManyTransfer(
      ids.map((transfer) => transfer.id.toString()),
    );
  }

  @Delete(':transferID')
  // @CheckPoliciesAbility(new PolicyHandlerTransferDelete())
  async deleteOneById(@Param('transferID') id: string) {
    return this.transferService.deleteTransfer(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.findAll)
  findAllEvent(query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.createMany)
  createManyEvent(createsDto: CreateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.updateMany)
  updateManyEvent(updatesDto: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.deleteMany)
  deleteManyByIdEvent(ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.deleteOneById)
  deleteOneByIdEvent(id: string, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.findOneById)
  async findOneByIdEvent(
    @Payload() transferId: string,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.transferService.getOne(transferId);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.findOneByIdToCrmSend)
  async findOneByIdToCrmSendEvent(
    @Payload() transferId: string,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.transferService
      .getAll({
        where: {
          _id: transferId,
        },
        relations: ['pspAccount'],
      })
      .then((transfer) => transfer.list[0]);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.findByLead)
  async findByLead(@Payload() leadId: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.transferService.getByLead(leadId);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.createOne)
  async createOneEvent(
    @Payload() createTransferDto: TransferCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const transfer = await this.transferService.newTransfer(createTransferDto);
    CommonService.ack(ctx);
    return transfer;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesTransferEnum.updateOne)
  async updateOneEvent(
    @Payload() updateTransferDto: TransferUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    return this.transferService.updateTransfer(updateTransferDto);
  }

  @AllowAnon()
  @EventPattern(EventsNamesTransferEnum.checkTransfersForPspAccountStats)
  async checkAllLeadsForPspAccountStats(
    @Payload() pspAccountId: string,
    @Ctx() ctx: RmqContext,
  ) {
    // TODO[hender] Refactor on ".service"
    await this.builder.getPromiseStatsEventClient(
      EventsNamesStatsEnum.removeAllStatsPspAccount,
      {
        pspAccount: pspAccountId,
      },
    );
    let page = 1;
    let nextPage = 2;
    const pspAccountStats = {
      id: pspAccountId,
      ...this.getResetStats(),
    } as PspAccountInterface;
    while (nextPage != 1) {
      const transfersToCheck = await this.transferService.getAll({
        page,
        relations: ['lead'],
        where: {
          pspAccount: pspAccountId,
        },
      });
      await this.builder.getPromiseStatsEventClient(
        EventsNamesStatsEnum.checkAllStatsPspAccount,
        {
          list: transfersToCheck.list,
        },
      );
      page = transfersToCheck.nextPage;
      nextPage = transfersToCheck.nextPage;
      Logger.log(
        `Saved page of PSP ACCOUNT ${pspAccountId} lead's. ${transfersToCheck.currentPage} / ${transfersToCheck.lastPage} pages`,
        TransferServiceController.name,
      );
    }
    const listStatsPspAccount = await this.builder.getPromiseStatsEventClient(
      EventsNamesStatsEnum.findAllStatsPspAccount,
      {
        where: {
          pspAccount: pspAccountId,
        },
      },
    );
    this.updateStat(pspAccountStats, listStatsPspAccount.list);
    await this.builder.getPromisePspAccountEventClient(
      EventsNamesPspAccountEnum.updateOne,
      pspAccountStats,
    );
    CommonService.ack(ctx);
  }

  @AllowAnon()
  @EventPattern(EventsNamesTransferEnum.checkTransferStatsByQuery)
  async checkTransferStatsByQuery(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    //return this.transferService.checkTransferStatsByQuery(query);
  }

  @AllowAnon()
  @EventPattern(EventsNamesTransferEnum.checkTransferInCashierByStatus)
  async checkTransferInCashierByStatus(
    @Payload() statusId: string,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    if (!statusId || statusId === '') {
      this.transferService.checkTransferInCashierSended();
      this.transferService.checkTransferInCashierPending();
      return { message: 'Success' };
    } else if (isMongoId(statusId)) {
      this.transferService.checkTransferInCashierByStatus(statusId);
      return { message: `Success status: ${statusId}` };
    }
    throw new NotFoundException(`Not found status "${statusId}"`);
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
          query.where.businessUnit = {
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

  private async updateOperationTypeOneFromPageAffiliate(
    req: Request,
    updatePaymentTransferDto: TransferUpdateWithdrawalDto,
    operationType: OperationTransactionType,
  ) {
    const query = {
      where: {
        _id: updatePaymentTransferDto.id,
        affiliate: await this.transferService.getAffiliateIsAdmin(
          req['affiliate'],
        ),
        operationType: operationType,
      },
    };
    const transfer = await this.transferService.updateTransferByIdPayment(
      updatePaymentTransferDto,
      query,
    );
    return new TransferAffiliateResponseDto(transfer);
  }

  private getResetStats() {
    return {
      quantityLeads: 0,
      totalLeads: 0,
      quantityFtd: 0,
      totalFtd: 0,
      quantityCftd: 0,
      totalCftd: 0,
      totalConversion: 0,
      quantityAffiliateFtd: 0,
      totalAffiliateFtd: 0,
      totalAffiliateConversion: 0,
    };
  }

  private updateStat(
    stats: PspAccountInterface | PspInterface,
    listStats: Array<StatsDatePspAccountDocument>,
  ) {
    for (const stat of listStats) {
      stats.quantityLeads += stat.quantityLeads;
      stats.totalLeads += stat.totalLeads;
      stats.quantityFtd += stat.quantityFtd;
      stats.totalFtd += stat.totalFtd;
      stats.quantityCftd += stat.quantityCftd;
      stats.totalCftd += stat.totalCftd;
      stats.totalConversion += stat.conversion;
      stats.quantityAffiliateFtd += stat.quantityApprovedLead;
      stats.totalAffiliateFtd += stat.totalApprovedLead;
      stats.totalAffiliateConversion += stat.conversionApprovedLead;
    }
  }

  private getTransferToAffiliate(
    paginator: ResponsePaginator<TransferDocument>,
  ): ResponsePaginator<TransferAffiliateResponseDto> {
    const rta: ResponsePaginator<TransferAffiliateResponseDto> =
      new ResponsePaginator<TransferAffiliateResponseDto>();
    rta.list = [];
    rta.currentPage = paginator.currentPage;
    rta.elementsPerPage = paginator.elementsPerPage;
    rta.firstPage = paginator.firstPage;
    rta.lastPage = paginator.lastPage;
    rta.nextPage = paginator.nextPage;
    rta.order = paginator.order;
    rta.prevPage = paginator.prevPage;
    rta.totalElements = paginator.totalElements;
    for (const transfer of paginator.list) {
      rta.list.push(new TransferAffiliateResponseDto(transfer));
    }
    return rta;
  }
}
