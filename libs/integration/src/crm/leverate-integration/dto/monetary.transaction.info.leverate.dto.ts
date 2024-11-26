import { PickListInfoLeverateDto } from './pick.list.iInfo.leverate.dto';

export class MonetaryTransactionRequestInfoLeverateDto {
  constructor(data?: MonetaryTransactionRequestInfoLeverateDto) {
    Object.assign(this, data ?? {});
  }
  amount: number;
  tradingPlatformAccountId: string;
  internalComment: string;
  transactionReference: string;
  affiliateTransactionId: string;
  additionalInfo: string;
  originalAmount: number;
  originalCurrency: PickListInfoLeverateDto;
  paymentInfo: JSON;
}
