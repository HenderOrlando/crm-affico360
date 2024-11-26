import { PickListInfoLeverateDto } from './pick.list.iInfo.leverate.dto';

export class CreditCardInfoLeverateDto {
  constructor(data?: CreditCardInfoLeverateDto) {
    Object.assign(this, data ?? {});
  }
  holderName: string;
  holderIdentity: string;
  number: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  cardIssuingBank: string;
  type: PickListInfoLeverateDto;
}
