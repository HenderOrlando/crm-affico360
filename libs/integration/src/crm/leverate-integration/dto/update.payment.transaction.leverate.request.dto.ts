import { PickListInfoLeverateDto } from './pick.list.iInfo.leverate.dto';

export class UpdatePaymentTransactionLeverateRequest {
  constructor(data?: UpdatePaymentTransactionLeverateRequest) {
    Object.assign(this, data ?? {});
  }
  pspStatus: PickListInfoLeverateDto;
  paymentTransactionId: string;
  cardHolderIdentity: string;
  cardHolderName: string;
  cardType: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  cardIssuingBank: string;
  description: string;
  creditCard: string;
  errorDescription: string;
}
