import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IntegrationCrmService } from '../generic/integration.crm.service';
import { GetDepositDto } from '../generic/dto/get-deposit.dto';
import { GetSalesStatusesDto } from '../generic/dto/get-sales-statuses.dto';
import { GetStatsDto } from '../generic/dto/get-stats.dto';
import { GetUserDto } from '../generic/dto/get-user.dto';
import { GetUsersDto } from '../generic/dto/get-users.dto';
import { RegenerateUserAutoLoginUrlDto } from '../generic/dto/regenerate-user-auto-login-url.dto';
import { RegisterUserDto } from '../generic/dto/register-user.dto';
import { SyncUserNoteDto } from '../generic/dto/sync-user-note-dto.dto';
import { SyncUserTransactionDto } from '../generic/dto/sync-user-transaction.dto';
import { TrackVisitDto } from '../generic/dto/track-visit.dto';
import { UserResponseDto } from '../generic/dto/user.response.dto';
import { RegisterLeadLeverateRequestDto } from './dto/register.lead.leverate.request.dto';
import { LeverateRegisterResponseDto } from './result/leverate.register.response.dto';
import { GetLeadDataFromCRMInterface } from '../generic/interface/get.lead.data.from.crm.interface';
import { GenerateCrmTokenInterface } from '../generic/interface/generate.crm.token.interface';
import { CrmGenerateTokenResponseDto } from '../generic/dto/crm.generate.token.response.dto';
import { GenerateTokenCrmRequestDto } from '../generic/dto/generate.token.crm.dto';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import { PaymentResponseDto } from '../generic/dto/payment.response.dto';
import { RegisterPaymentDto } from '../generic/dto/register-payment.dto';
import { UpdatePaymentDto } from '../generic/dto/update.payment.dto';
import { CrmCreateWithdrawalDto } from '../generic/dto/crm.create.withdrawal.dto';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { LeverateRegenerateUserAutoLoginUrlDto } from './result/regenerate-user-auto-login-url.response';
import { RpcException } from '@nestjs/microservices';
import { LeadAccountDetailsResponse } from './dto/lead.account.details.response.dto';
import { InfoResponseLeverateDto } from './dto/result.response.leverate.dto';
import { MonetaryTransactionRequestLeverateDto } from './dto/create.monetary.transaction.request.dto';
import { AssignLeadLeverateRequestDto } from './dto/assign.lead.leverate.request.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeverateIntegrationService
  extends IntegrationCrmService<
    // DTO
    TrackVisitDto,
    RegisterUserDto,
    RegisterLeadLeverateRequestDto,
    RegisterPaymentDto,
    UpdatePaymentDto,
    GetUserDto,
    GetUsersDto,
    SyncUserNoteDto,
    RegenerateUserAutoLoginUrlDto,
    GetDepositDto,
    SyncUserTransactionDto,
    GetStatsDto,
    GetSalesStatusesDto,
    // Results
    LeverateRegisterResponseDto,
    InfoResponseLeverateDto,
    LeadAccountDetailsResponse
  >
  implements GetLeadDataFromCRMInterface, GenerateCrmTokenInterface
{
  constructor(_crm: CrmDocument, protected configService: ConfigService) {
    super(_crm, configService);
    super.setRouteMap({
      // Affiliate
      generateApiKey: '/token',
      affiliateRegisterLead: '/accounts/real',
      affiliateAssignLead:
        'https://apiv9.tradingcrm.com:8443/api/Assign/AssignAccountOwner',
      affiliateGetUsers: 'accounts',
      affiliateRegenerateUserAutoLoginUrl: 'api/auth/login',
      affiliateGetDeposit: '/transactions',
      // Monetary Transaction
      crmAccountDetails:
        'https://apiv9.tradingcrm.com:8443/api/AccountDetails/GetAccountDetailsByTradingPlatformName',
      crmGenerateToken:
        'https://apiv9.tradingcrm.com:8443/api/authorization/generatetoken',
      crmCreateWithdrawalRequest: '',
      crmCreateCreaditCardDepositRequest: '',
      crmCreateMonetaryTransactionRequest:
        'https://apiv9.tradingcrm.com:8443/api/MonetaryTransaction/CreateMonetaryTransaction',
      crmCreateWithdrawalCancellationTransactionStatusRequest: '',
      crmGetMonetaryTransactionPerTPAccountRequest: '',
      // Payment Transaction
      crmCreatePaymentTransaction:
        'https://apiv9.tradingcrm.com:8443/api/MonetaryTransaction/CreateMonetaryTransaction',
      crmUpdatePaymentTransaction: '',
    });
  }

  async crmLeadAccountDetails(
    leadTpName: string,
  ): Promise<LeadAccountDetailsResponse> {
    await this.generateCrmToken({
      organization: this.crm.organizationCrm,
      id: this.crm.idCrm,
      secret: this.crm.secretCrm,
    });
    super.setTokenCrm(this.tokenCrm);
    return super.crmLeadAccountDetails(leadTpName);
  }

  async generateCrmToken(
    data: GenerateTokenCrmRequestDto,
  ): Promise<CrmGenerateTokenResponseDto> {
    //if (true) {
    Logger.debug(data, 'Generate Token CRM');
    if (!this.crm.token || this.hasTokenCrmExpired(this.crm.expTimeToken)) {
      const url = `${super.getRouteMap().crmGenerateToken}/${
        data.organization
      }/${data.id}/${data.secret}`;
      try {
        const rta: CrmGenerateTokenResponseDto = await this.http.get(url);
        this.crm.token = rta.data.token;
        this.crm.expTimeToken = new Date(rta.data.expTime);
        await this.crm.save();
      } catch (err) {
        Logger.error(
          `${url}`,
          `${LeverateIntegrationService.name}:generateCrmToken`,
        );
        Logger.error(`${url}`, LeverateIntegrationService.name);
        Logger.error(err, LeverateIntegrationService.name);
      }
    }
    super.setTokenCrm(this.crm.token);
    return new CrmGenerateTokenResponseDto({
      token: this.crm?.token,
      expTime: this.crm?.expTimeToken,
    });
  }

  hasTokenCrmExpired(expTimeToken) {
    if (expTimeToken) {
      const expire = new Date(expTimeToken);
      const now = new Date();
      Logger.debug(expire.getTime() <= now.getTime(), 'Has expired crm token');
      return expire.getTime() <= now.getTime();
    }
    return true;
  }

  async crmRegisterPayment(
    transfer: TransferInterface,
  ): Promise<InfoResponseLeverateDto> {
    Logger.warn(
      `Transfer ${transfer._id} - ${transfer.numericId}`,
      'crmCreateDeposit',
    );
    await this.generateCrmToken({
      organization: this.crm.organizationCrm,
      id: this.crm.idCrm,
      secret: this.crm.secretCrm,
    });
    const registerPaymentDto = new MonetaryTransactionRequestLeverateDto(
      transfer,
    );
    const rta = await super.crmRegisterPayment(registerPaymentDto);
    return rta['result'] as InfoResponseLeverateDto;
  }

  async crmCreateWithdrawal(
    transfer: TransferInterface,
  ): Promise<InfoResponseLeverateDto> {
    Logger.warn(
      `Transfer ${transfer._id} - ${transfer.numericId}`,
      'crmCreateWithdrawal',
    );
    await this.generateCrmToken({
      organization: this.crm.organizationCrm,
      id: this.crm.idCrm,
      secret: this.crm.secretCrm,
    });
    const registerPaymentDto = new MonetaryTransactionRequestLeverateDto(
      transfer,
    );
    return super.crmRegisterPayment(registerPaymentDto);
  }
  async crmCreateCredit(
    transfer: TransferInterface,
  ): Promise<InfoResponseLeverateDto> {
    Logger.warn(
      `Transfer ${transfer._id} - ${transfer.numericId}`,
      'crmCreateCredit',
    );
    await this.generateCrmToken({
      organization: this.crm.organizationCrm,
      id: this.crm.idCrm,
      secret: this.crm.secretCrm,
    });
    const registerPaymentDto = new MonetaryTransactionRequestLeverateDto(
      transfer,
    );
    return super.crmRegisterPayment(registerPaymentDto);
  }

  async affiliateAssignLead(
    assignLeadDto: AssignLeadLeverateRequestDto,
  ): Promise<LeverateRegisterResponseDto> {
    await this.generateCrmToken({
      organization: this.crm.organizationCrm,
      id: this.crm.idCrm,
      secret: this.crm.secretCrm,
    });
    const rta: LeverateRegisterResponseDto = await super.affiliateAssignLead(
      assignLeadDto,
    );
    return rta;
  }

  async affiliateRegisterLead(
    registerLeadDto: RegisterLeadLeverateRequestDto,
  ): Promise<LeverateRegisterResponseDto> {
    const leadRta = await super.affiliateRegisterLead(registerLeadDto);
    return (
      leadRta &&
      (this.getLeadDataFromCRM(leadRta) as LeverateRegisterResponseDto)
    );
  }

  async affiliateRegenerateUserAutoLoginUrl(
    regenerateUserAutoLoginUrlDto: RegenerateUserAutoLoginUrlDto,
  ): Promise<LeverateRegenerateUserAutoLoginUrlDto> {
    const rta: LeverateRegenerateUserAutoLoginUrlDto =
      (await super.affiliateRegenerateUserAutoLoginUrl(
        regenerateUserAutoLoginUrlDto,
      )) as unknown as LeverateRegenerateUserAutoLoginUrlDto;
    const urlBase = this.crm.clientZone
      .replace('https://', '')
      .replace('http://', '');
    if (rta?.jwt) {
      rta.url = `https://${urlBase}/?ssoToken=${rta?.jwt}`;
      return rta;
    }
    throw new NotFoundException(
      `Not found ${regenerateUserAutoLoginUrlDto.email}`,
    );
  }

  getLeadDataFromCRM(
    leadLeverate: LeverateRegisterResponseDto,
  ): UserResponseDto {
    const lead: UserResponseDto = {
      id: leadLeverate.tpAccountName || leadLeverate.accountId,
      accountId: leadLeverate.accountId,
      accountPassword: leadLeverate.tpAccountPassword,
      ...leadLeverate,
    };
    if (!lead.id) {
      throw new RpcException(lead);
    }
    return lead;
  }
}
