import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { BasicDataIntegration } from '@integration/integration/domain/basic.data.integration.interface';
import { IntegrationCashierInterface } from '@integration/integration/payment/generic/integration.payment.interface';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import PaymentRoutesInterface from './domain/payment.routes.interface';
import { BasicUrlToPayResponseInterface } from './domain/basic.url.to.pay.response.interface';
import { BasicUrlToPayRequestInterface } from './domain/basic.url.to.pay.request.interface';

export class IntegrationPaymentService implements IntegrationCashierInterface {
  http: AxiosInstance;
  env: EnvironmentEnum;
  private routesMap: PaymentRoutesInterface;

  constructor(
    private dataIntegration: BasicDataIntegration,
    public payment?: PspDocument,
  ) {}

  setRouteMap(routesMap: PaymentRoutesInterface) {
    this.routesMap = routesMap;
  }

  getRouteMap(): PaymentRoutesInterface {
    return this.routesMap;
  }

  async sendPayment<TRequest, TResponse = any>(
    request: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ): Promise<TResponse> {
    return this.http.post(this.routesMap.api.sendPayment, request, config);
  }

  async getPayment<TRequest, TResponse = any>(
    queryParams: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ): Promise<TResponse> {
    config = config || {};
    config.data = queryParams;
    return this.http.get(this.routesMap.api.getPayment, config);
  }

  async getUrlToPay<
    TRequest = BasicUrlToPayRequestInterface,
    TResponse = BasicUrlToPayResponseInterface,
  >(
    queryParams: TRequest,
    config?: AxiosRequestConfig<TRequest>,
  ): Promise<string> {
    config = config || {};
    config.data = queryParams;
    return this.http.get(this.routesMap.api.getUrlToPay, config);
  }
}
