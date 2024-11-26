import { BasicUrlToPayRequestInterface } from '../../generic/domain/basic.url.to.pay.request.interface';
export interface LatamCashierUrlToPayRequest
  extends BasicUrlToPayRequestInterface {
  tpId: string;
  pageId: string;
}
