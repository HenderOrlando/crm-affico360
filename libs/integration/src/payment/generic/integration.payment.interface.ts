import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { AxiosInstance } from 'axios';
import { BasicPaymentRequestInterface } from './domain/payment.request.interface';
import { BasicPaymentResponseInterface } from './domain/payment.response.interface';

export interface IntegrationCashierInterface<
  TRequest = BasicPaymentRequestInterface,
  TResponse = BasicPaymentResponseInterface,
> {
  http: AxiosInstance;
  env: EnvironmentEnum;
  sendPayment(request: TRequest): Promise<TResponse>;
  getPayment(request: TRequest): Promise<TResponse>;
  getUrlToPay(request: TRequest): Promise<string>;
}
