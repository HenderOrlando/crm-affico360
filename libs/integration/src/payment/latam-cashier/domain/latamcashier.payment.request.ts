import { BasicPaymentRequestInterface } from '../../generic/domain/payment.request.interface';

export interface LatamCashierPaymentRequest
  extends BasicPaymentRequestInterface {
  tpId: string;
}
