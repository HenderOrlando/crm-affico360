import { CommonService } from '@common/common';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import {
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';
import { isObject } from 'class-validator';
import { Observable } from 'rxjs';
import { AssignLeadLeverateRequestDto } from '../leverate-integration/dto/assign.lead.leverate.request.dto';
import { CrmCreateCreditDto } from './dto/crm.create.credit.dto';
import { CrmCreateWithdrawalDto } from './dto/crm.create.withdrawal.dto';
import { CrmCreateWithdrawalResponseDto } from './dto/crm.create.withdrawal.response.dto';
import { GetDepositDto } from './dto/get-deposit.dto';
import { GetSalesStatusesDto } from './dto/get-sales-statuses.dto';
import { GetStatsDto } from './dto/get-stats.dto';
import { GetUserDto } from './dto/get-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { LeadAccountResponseDto } from './dto/lead.account.response.dto';
import { PaymentResponseDto } from './dto/payment.response.dto';
import { RegenerateUserAutoLoginUrlDto } from './dto/regenerate-user-auto-login-url.dto';
import { RegisterLeadDto } from './dto/register-lead.dto';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SyncUserNoteDto } from './dto/sync-user-note-dto.dto';
import { SyncUserTransactionDto } from './dto/sync-user-transaction.dto';
import { TrackVisitDto } from './dto/track-visit.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { IntegrationCrmInterface } from './integration.crm.interface';
import { CrmRoutesInterface } from './interface/crm.routes.interface';
import { DataPostUrlEncode } from './types/integration.crm.type';
import { EnvironmentEnum } from '@common/common/enums/environment.enum';

export class IntegrationCrmService<
  // DTO
  TTrackVisitDto = TrackVisitDto,
  TRegisterUserDto = RegisterUserDto,
  TRegisterLeadDto = RegisterLeadDto,
  TRegisterPaymentDto = RegisterPaymentDto,
  TUpdatePaymentDto = RegisterPaymentDto,
  TGetUserDto = GetUserDto,
  TGetUsersDto = GetUsersDto,
  TSyncUserNoteDto = SyncUserNoteDto,
  TRegenerateUserAutoLoginUrlDto = RegenerateUserAutoLoginUrlDto,
  TGetDepositDto = GetDepositDto,
  TSyncUserTransactionDto = SyncUserTransactionDto,
  TGetStatsDto = GetStatsDto,
  TGetSalesStatusesDto = GetSalesStatusesDto,
  // Results
  TUserResponse = UserResponseDto,
  TPaymentResponse = PaymentResponseDto,
  TLeadAccountResponse = LeadAccountResponseDto,
> implements
    IntegrationCrmInterface<
      TTrackVisitDto,
      TRegisterUserDto,
      TRegisterLeadDto,
      TRegisterPaymentDto,
      TUpdatePaymentDto,
      TGetUserDto,
      TGetUsersDto,
      TSyncUserNoteDto,
      TRegenerateUserAutoLoginUrlDto,
      TGetDepositDto,
      TSyncUserTransactionDto,
      TGetStatsDto,
      TGetSalesStatusesDto,
      TUserResponse,
      TPaymentResponse,
      LeadAccountResponseDto
    >
{
  http: AxiosInstance;
  private routesMap: CrmRoutesInterface;
  private username: string;
  private password: string;
  private urlBase: string;
  private apiKey: string;
  private token: string;
  private urlEncoded = true;
  protected tokenCrm: string;

  constructor(
    public crm: CrmDocument,
    protected configService: ConfigService,
  ) {}

  setRouteMap(routesMap: CrmRoutesInterface) {
    this.routesMap = routesMap;
  }

  getRouteMap(): CrmRoutesInterface {
    return this.routesMap;
  }

  setUrlBase(urlBase: string) {
    this.urlBase = urlBase;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setToken(token: string) {
    this.token = token;
  }

  setTokenCrm(tokenCrm: string) {
    this.tokenCrm = tokenCrm;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateHttp() {
    if (!!this.urlBase) {
      const param = {
        baseURL: this.urlBase,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Encoding': '*',
        },
      } as CreateAxiosDefaults;
      if (!!this.token) {
        param.headers['Authorization'] = 'Bearer ' + this.token;
      } else if (!!this.apiKey) {
        param.params = {
          apikey: this.apiKey,
        };
      } else {
        this.urlEncoded = false;
        try {
          const token = await axios.post(`${this.urlBase}token`, {
            username: this.username,
            password: this.password,
          });
          const today = new Date();
          this.token = token.data?.Token || token.data.token;
          const expireIn = token.data?.expiresIn || token.data?.ExpiresIn;
        } catch (err) {
          Logger.error(err, IntegrationCrmService.name);
          Logger.error(
            'integration.crm.service.ts:151 ->',
            IntegrationCrmService.name,
          );
          Logger.error(
            `urlBase -> ${this.urlBase}`,
            IntegrationCrmService.name,
          );
          Logger.error(
            `token -> ${JSON.stringify({
              username: this.username,
              password: this.password,
            })}`,
            IntegrationCrmService.name,
          );
          //throw new BadRequestException(err);
        }
        // Todo[hender] Save token and check if already expire
        //this.dateToExpireToken = today.getTime() + expireIn;
        param.headers['Authorization'] = 'Bearer ' + this.token;
        param.headers['Api-Version'] = 3;
      }
      //axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      this.http = axios.create(param);
    } else {
      throw new BadRequestException('The "UrlBase" is necessary');
    }
  }

  affiliateTrackVisit(
    trackVisitDto: TTrackVisitDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http.get(this.routesMap.affiliateTrackVisit);
    return rta as any;
  }

  affiliateRegisterUser(
    registerUserDto: TRegisterUserDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http.post(this.routesMap.affiliateRegisterUser);
    return rta as any;
  }

  async affiliateRegisterLead(
    registerLeadDto: TRegisterLeadDto,
  ): Promise<TUserResponse> {
    Logger.debug(JSON.stringify(registerLeadDto), 'Data registerLeadDto');
    if (
      this.configService.get<string>('ENVIRONMENT') === EnvironmentEnum.prod
    ) {
      const rta: AxiosResponse =
        await CommonService.getTimeToFunction<AxiosResponse>(
          async () =>
            await this.getPostUrlEncoded(
              this.routesMap.affiliateRegisterLead,
              registerLeadDto,
            ),
          `'POST register lead to CRM ${registerLeadDto['email']}`,
        );
      const data: TUserResponse = rta?.data ?? rta;
      Logger.debug(data, 'Data axios');
      if (!isObject(data) || data['error']) {
        const error = (isObject(data['error']) && data['error']) || data;
        Logger.error(error, IntegrationCrmService.name);
      }
      return data;
    }
    return { accountId: '123Abc' } as TUserResponse;
  }

  async affiliateAssignLead(
    assignLeadDto: AssignLeadLeverateRequestDto,
  ): Promise<TUserResponse> {
    Logger.debug(JSON.stringify(assignLeadDto), 'Assignat lead');
    if (
      this.configService.get<string>('ENVIRONMENT') === EnvironmentEnum.prod
    ) {
      const rta: AxiosResponse =
        await CommonService.getTimeToFunction<AxiosResponse>(
          async () =>
            await this.getPostUrlEncoded(
              this.routesMap.affiliateAssignLead,
              assignLeadDto.leadStatus,
              true,
              {
                accountId: assignLeadDto.accountId,
                userId: assignLeadDto.userId,
              },
            ),
          `'POST assign lead to CRM ${assignLeadDto['email']}`,
        );
      const data: TUserResponse = rta?.data ?? rta;
      if (!isObject(data) || data['error']) {
        const error = (isObject(data['error']) && data['error']) || data;
        Logger.error(error, IntegrationCrmService.name);
        //throw new BadRequestException();
      }
      return data;
    }
    return null;
  }

  private async getPostUrlEncoded(
    url: string,
    data: DataPostUrlEncode,
    needTokenCrm = false,
    params = null,
  ): Promise<AxiosResponse> {
    try {
      if (this.urlEncoded) {
        return this.http.post(url, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
          transformRequest: [this.urlSerializeData],
        });
      }
      const reqConfig: AxiosRequestConfig = this.getHeaders(needTokenCrm);
      reqConfig.data = data;
      if (params) {
        reqConfig.params = params;
      }
      Logger.debug(reqConfig, `Post URL Encoded ${url}`);
      return this.http.post(url, JSON.stringify(data), reqConfig);
    } catch (error) {
      return this.getError(error);
    }
  }

  private getError(error) {
    error.code = error.response?.code || error.response?.status || 400;
    //throw new RpcException(error || data);
    delete error.config;
    delete error.request;
    Logger.error(error, 'Get Error');
    error.message = error?.response?.data;
    delete error.response;
    return {
      error: true,
      ...error,
    };
  }

  private getBasicHeaders() {
    return {
      headers: {
        Accept: `*\/*`,
        'Content-Type': 'application/json',
        Authorization: undefined,
      },
    };
  }
  private getHeaders(needTokenCrm = false) {
    const headers = this.getBasicHeaders();
    headers.headers['Authorization'] = this.tokenCrm;
    headers.headers['Content-Type'] = 'application/json';
    if (!needTokenCrm) {
      headers.headers['Api-Version'] = 4;
      headers.headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  affiliateGetSalesStatuses(
    getSalesStatusesDto: TGetSalesStatusesDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http(this.routesMap.affiliateGetSalesStatuses);
    return rta as any;
  }

  private urlSerializeData(data, headers) {
    const serializedData = [];

    for (const k in data) {
      if (data[k]) {
        serializedData.push(`${k}=${encodeURIComponent(data[k])}`);
      }
    }

    return serializedData.join('&');
  }

  affiliateGetUser(getUserDto?: TGetUserDto): Promise<any> {
    const rta = this.http.get(this.routesMap.affiliateGetUser);
    return rta;
  }

  async affiliateGetUsers(getUsersDto?: TGetUsersDto): Promise<any> {
    const headers = this.getHeaders();
    const url =
      this.routesMap.affiliateGetUsers +
      (getUsersDto ? getUsersDto.toString() : '');
    try {
      headers.headers.Accept = 'application/json';
      delete headers.headers['Content-Type'];
      //Logger.debug(url, `URL leverate - ${this.crm.name}`);
      //Logger.debug(headers, 'headers leverate');
      return this.http.get(url, headers);
    } catch (err) {
      Logger.error(
        JSON.stringify({
          name: this.crm.userCrm,
          pass: this.crm.passwordCrm,
        }),
        'Brand error',
      );
      Logger.error(
        err,
        `error ${this.urlBase + url}:${JSON.stringify(headers)}`,
      );
      //throw new BadRequestException('The clientZone is required');
      return null;
    }
  }

  affiliateSyncUserNote(
    syncUserNoteDto: TSyncUserNoteDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http.post(this.routesMap.affiliateSyncUserNote);
    return rta as any;
  }

  async affiliateRegenerateUserAutoLoginUrl(
    regenerateUserAutoLoginUrlDto: TRegenerateUserAutoLoginUrlDto,
  ): Promise<any> {
    if (!this.crm.clientZone) {
      throw new BadRequestException('The clientZone is required');
    }
    try {
      if (this.crm.clientZone.indexOf('http') !== 0) {
        this.crm.clientZone = `https://${this.crm.clientZone}`;
      }
      Logger.debug(this.crm.clientZone, 'Clientzone autologin');
      Logger.debug(
        this.routesMap.affiliateRegenerateUserAutoLoginUrl,
        'route autologin',
      );
      Logger.debug(regenerateUserAutoLoginUrlDto, 'data autologin');
      const rta = await axios.post(
        `${this.crm.clientZone}/${this.routesMap.affiliateRegenerateUserAutoLoginUrl}`,
        regenerateUserAutoLoginUrlDto,
      );
      return rta?.data;
    } catch (err) {
      Logger.error(regenerateUserAutoLoginUrlDto, 'error autologin');
      const error = this.getError(err);
      throw new UnauthorizedException();
    }
  }

  affiliateGetDeposit(
    getDepositDto: TGetDepositDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http.get(this.routesMap.affiliateGetDeposit);
    return rta as any;
  }

  affiliateSyncUserTransaction(
    syncUserTransactionDto: TSyncUserTransactionDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http.post(this.routesMap.affiliateSyncUserTransaction);
    return rta as any;
  }

  affiliateGetStats(
    getStatsDto: TGetStatsDto,
  ): Observable<AxiosResponse<any[]>> {
    const rta = this.http(this.routesMap.affiliateGetStats);
    return rta as any;
  }

  async crmRegisterPayment(
    registerPaymentDto: TRegisterPaymentDto,
  ): Promise<TPaymentResponse> {
    const rta: AxiosResponse = await this.getPostUrlEncoded(
      this.routesMap.crmCreateMonetaryTransactionRequest,
      registerPaymentDto,
      true,
    );
    const data: TPaymentResponse = rta?.data ?? rta;
    Logger.debug(
      data,
      `crm register payment to ${registerPaymentDto['leadEmail']}`,
    );
    if (!isObject(data) || data['error']) {
      const error = (isObject(data['error']) && data['error']) || data;
      throw new RpcException(error as any);
    }
    return data;
  }

  async crmLeadAccountDetails(leadTpId: string): Promise<TLeadAccountResponse> {
    const url = `${this.routesMap.crmAccountDetails}/${leadTpId}/LTT`;
    const headers = this.getHeaders(true);
    try {
      const rta: AxiosResponse = await this.http.get(url, headers);
      const data: TLeadAccountResponse = rta?.data ?? rta;
      if (
        !isObject(data) ||
        !isObject(data['result']) ||
        data['result']['code'] !== 'Success'
      ) {
        const result = (isObject(data['result']) && data['result']) || data;
        const error = {
          code: 500,
          message: result['code'],
          description: result['message'],
        };
        throw new RpcException(error as any);
      }
      return data;
    } catch (err) {
      Logger.error(`URL -> ${url}`, `${this.crm.name}:url account`);
      Logger.error(
        `HEADERS -> ${JSON.stringify(headers)}`,
        `${this.crm.name}:headers account`,
      );
      Logger.error(JSON.stringify(err), `${this.crm.name}:error account`);
      throw new BadRequestException(err);
    }
  }

  async crmUpdatePayment(
    updatePaymentDto: TUpdatePaymentDto,
  ): Promise<TPaymentResponse> {
    const rta: AxiosResponse = await this.getPostUrlEncoded(
      this.routesMap.affiliateRegisterLead,
      updatePaymentDto,
      true,
    );
    const data: TPaymentResponse = rta?.data ?? rta;
    if (!isObject(data) || data['error']) {
      const error = (isObject(data['error']) && data['error']) || data;
      throw new RpcException(error as any);
    }
    return data;
  }

  async crmCreateWithdrawal(
    transfer: TransferInterface,
  ): Promise<CrmCreateWithdrawalResponseDto> {
    const rta: AxiosResponse = await this.getPostUrlEncoded(
      this.routesMap.crmCreatePaymentTransaction,
      new CrmCreateWithdrawalDto(transfer),
      true,
    );
    const data: TPaymentResponse = rta?.data ?? rta;
    if (!isObject(data) || data['error']) {
      const error = (isObject(data['error']) && data['error']) || data;
      throw new RpcException(error as any);
    }
    return data;
  }
  async crmCreateCredit(
    transfer: TransferInterface,
  ): Promise<CrmCreateWithdrawalResponseDto> {
    const rta: AxiosResponse = await this.getPostUrlEncoded(
      this.routesMap.crmCreatePaymentTransaction,
      new CrmCreateCreditDto(transfer),
      true,
    );
    const data: TPaymentResponse = rta?.data ?? rta;
    if (!isObject(data) || data['error']) {
      const error = (isObject(data['error']) && data['error']) || data;
      throw new RpcException(error as any);
    }
    return data;
  }
}
