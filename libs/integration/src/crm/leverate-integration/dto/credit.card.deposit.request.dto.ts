import { PickListInfoLeverateDto } from './pick.list.iInfo.leverate.dto';

export class CreditCardDepositRequestDto {
  constructor(data?: CreditCardDepositRequestDto) {
    Object.assign(this, data ?? {});
  }
  defaultCaseTitle: string;
  tradingPlatformAccountId: string;
  amount: number;
  cardHolderName: string;
  cardHolderIdentityNumber: string;
  cardType: PickListInfoLeverateDto;
  cardLast4Digits: string;
  clearingResponse: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  cardIssuingBank: string;
  cardAcquirer: PickListInfoLeverateDto;
  cardAcquirerReference: string;
  originalAmount: number;
  originalCurrency: PickListInfoLeverateDto;
}
