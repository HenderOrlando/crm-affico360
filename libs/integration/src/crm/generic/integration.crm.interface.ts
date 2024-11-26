// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosInstance, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { RegisterLeadDto } from '@integration/integration/crm/generic/dto/register-lead.dto';
import { SyncUserNoteDto } from '@integration/integration/crm/generic/dto/sync-user-note-dto.dto';
import { GetUsersDto } from '@integration/integration/crm/generic/dto/get-users.dto';
import { GetUserDto } from '@integration/integration/crm/generic/dto/get-user.dto';
import { RegenerateUserAutoLoginUrlDto } from '@integration/integration/crm/generic/dto/regenerate-user-auto-login-url.dto';
import { GetDepositDto } from '@integration/integration/crm/generic/dto/get-deposit.dto';
import { SyncUserTransactionDto } from '@integration/integration/crm/generic/dto/sync-user-transaction.dto';
import { GetStatsDto } from '@integration/integration/crm/generic/dto/get-stats.dto';
import { GetSalesStatusesDto } from '@integration/integration/crm/generic/dto/get-sales-statuses.dto';
import { TrackVisitDto } from '@integration/integration/crm/generic/dto/track-visit.dto';
import { RegisterUserDto } from '@integration/integration/crm/generic/dto/register-user.dto';
import { UserResponseDto } from '@integration/integration/crm/generic/dto/user.response.dto';
import { RegisterPaymentDto } from '@integration/integration/crm/generic/dto/register-payment.dto';
import { PaymentResponseDto } from '@integration/integration/crm/generic/dto/payment.response.dto';
import { UpdatePaymentDto } from '@integration/integration/crm/generic/dto/update.payment.dto';
import { CrmCreateWithdrawalDto } from '@integration/integration/crm/generic/dto/crm.create.withdrawal.dto';
import { CrmCreateWithdrawalResponseDto } from '@integration/integration/crm/generic/dto/crm.create.withdrawal.response.dto';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { LeadAccountResponseDto } from '@integration/integration/crm/generic/dto/lead.account.response.dto';

export interface IntegrationCrmInterface<
  TTrackVisitDto = TrackVisitDto,
  TRegisterUserDto = RegisterUserDto,
  TRegisterLeadDto = RegisterLeadDto,
  TRegisterPaymentDto = RegisterPaymentDto,
  TUpdatePaymentDto = UpdatePaymentDto,
  TGetUserDto = GetUserDto,
  TGetUsersDto = GetUsersDto,
  TSyncUserNoteDto = SyncUserNoteDto,
  TRegenerateUserAutoLoginUrlDto = RegenerateUserAutoLoginUrlDto,
  TGetDepositDto = GetDepositDto,
  TSyncUserTransactionDto = SyncUserTransactionDto,
  TGetStatsDto = GetStatsDto,
  TGetSalesStatusesDto = GetSalesStatusesDto,
  TUserResponse = UserResponseDto,
  TPaymentResponse = PaymentResponseDto,
  TCrmCreateWithdrawalDto = CrmCreateWithdrawalDto,
  TCrmCreateWithdrawalResponseDto = CrmCreateWithdrawalResponseDto,
  TLeadAccountResponse = LeadAccountResponseDto,
> {
  http: AxiosInstance;
  /*routesMap: CrmRoutesInterface;
  urlBase: string;
  username: string;
  password: string;
  token: string;
  tokenCrm: string;
  apiKey: string;*/

  generateHttp();

  affiliateTrackVisit(
    trackVisitDto: TTrackVisitDto,
  ): Observable<AxiosResponse<any[]>>;

  affiliateRegisterUser(
    registerUserDto: TRegisterUserDto,
  ): Observable<AxiosResponse<any[]>>;

  affiliateRegisterLead(
    registerLeadDto: TRegisterLeadDto,
  ): Promise<TUserResponse | UserResponseDto>;

  affiliateGetUser(getUserDto: TGetUserDto): Promise<any>;

  affiliateGetUsers(getUsersDto: TGetUsersDto): Promise<any>;

  affiliateSyncUserNote(
    syncUserNoteDto: TSyncUserNoteDto,
  ): Observable<AxiosResponse<any[]>>;

  affiliateRegenerateUserAutoLoginUrl(
    regenerateUserAutoLoginUrlDto: TRegenerateUserAutoLoginUrlDto,
  ): Promise<AxiosResponse<any[]>>;

  affiliateGetDeposit(
    getDepositDto: TGetDepositDto,
  ): Observable<AxiosResponse<any[]>>;

  affiliateSyncUserTransaction(
    syncUserTransactionDto: TSyncUserTransactionDto,
  ): Observable<AxiosResponse<any[]>>;

  affiliateGetStats(
    getStatsDto: TGetStatsDto,
  ): Observable<AxiosResponse<any[]>>;

  affiliateGetSalesStatuses(
    getSalesStatusesDto: TGetSalesStatusesDto,
  ): Observable<AxiosResponse<any[]>>;

  crmRegisterPayment(
    registerPaymentDto: TRegisterPaymentDto,
  ): Promise<TPaymentResponse>;

  crmUpdatePayment(
    updatePaymentDto: TUpdatePaymentDto,
  ): Promise<TPaymentResponse>;

  crmCreateWithdrawal(
    transfer: TransferInterface,
  ): Promise<TCrmCreateWithdrawalResponseDto>;

  crmLeadAccountDetails(leadTpName: string): Promise<TLeadAccountResponse>;
}
