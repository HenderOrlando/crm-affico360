import { BasicPaymentResponseInterface } from '../../generic/domain/payment.response.interface';

export interface LatamCashierPaymentResponse
  extends BasicPaymentResponseInterface {
  success: boolean;
  payload: LatamCashierPayload;
}

export interface LatamCashierPayload {
  externalId: string;
  externalUserId: string;
  idPspCat: string;
  idPaymentMethodCat: string;
  idPageCat: string;
  amount: number;
  pspbodyRequest: LatamCashierPspbodyRequest;
  status: string;
  integration: string;
  idProvider: string;
  startAt: string;
  updateAt: string;
  active: boolean;
  notificationDate: any;
  pspResponse: LatamCashierPspResponse;
}

export interface LatamCashierPspbodyRequest {
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  currency: string;
  code: string;
  external_user_id: string;
  amount: number;
  page: string;
  external_transaction_id: number;
  transactionId: number;
  idTransaction: number;
}

export interface LatamCashierPspResponse {
  success: boolean;
  message: string;
  type: string;
  autoApproved: boolean;
  provider_id: string;
  url: string;
  log: string;
  payload: LatamCashierPayloadPsp;
}

export interface LatamCashierPayloadPsp {
  request_id: string;
  response_datetime: string;
  gateway_token_url: string;
  digest_check: string;
  error: any;
  custom_data: any;
  provider_id: string;
}
