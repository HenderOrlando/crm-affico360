import { CreditCardInfoLeverateDto } from './credit.card.info.leverate.dto';
import { WebMoneyInfoLeverateDto } from './web.money.info.leverate.dto';
import { WireTransferInfoLeverateDto } from './wire.transfer.info.leverate.dto';

export class WithdrawalRequestLeverateDto {
  constructor(data?: WithdrawalRequestLeverateDto) {
    Object.assign(this, data ?? {});
  }
  accountId: string;
  caseTitle: string;
  description: string;
  tradingPlatformAccountName: string;
  currencyId: string;
  withdrawalMethod: string;
  amount: number;
  creditCardWithdrawalDetails: CreditCardInfoLeverateDto;
  wireTransferWithdrawalDetails: WireTransferInfoLeverateDto;
  webMoneyWithdrawalDetails: WebMoneyInfoLeverateDto;
}
