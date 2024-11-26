import { BasicUrlToPayResponseInterface } from '../../generic/domain/basic.url.to.pay.response.interface';

export interface LatamCashierUrlToPayResponse
  extends BasicUrlToPayResponseInterface {
  url: string;
}
