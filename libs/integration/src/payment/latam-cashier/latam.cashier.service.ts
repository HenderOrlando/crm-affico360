import { IntegrationPaymentService } from '../generic/integration.payment.service';
import { LatamCashierUrlToPayRequest } from './domain/latamcashier.url.to.pay.request';
import { LatamCashierUrlToPayResponse } from './domain/latamcashier.url.to.pay.response';

export class LatamCashierService extends IntegrationPaymentService {
  async sendPayment<TRequest, TResponse>(req: TRequest): Promise<TResponse> {
    //this.routesMap.api.sendPayment;
    throw new Error('Method not implemented.');
  }

  async getPayment<TRequest, TResponse>(tpId: TRequest): Promise<TResponse> {
    const url = `https://psp-app.tech:4000/transactions/info/${tpId}`;
    //this.routesMap.api.getPayment;
    throw new Error('Method not implemented.');
  }

  async getUrlToPay(
    request: LatamCashierUrlToPayRequest,
  ): Promise<LatamCashierUrlToPayResponse> {
    //this.routesMap.api.getUrlToPay;
    //throw new Error('Method not implemented.');
    const url = `https://dev-tatsugirii.vercel.app/payment?mode=dark&user=${request.tpId}&page=${request.pageId}}`;
    return { url };
  }
}
