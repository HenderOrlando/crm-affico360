import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';

export class CrmCreateCreditDto {
  constructor(transfer: TransferInterface) {
    Object.assign(this, transfer);
  }
  accountId: string;
  caseTitle: string;
  description: string;
  tradingPlatformAccountName: string;
  amount: 0;
  currencyId: string;
  creditMethod: string; // 'Internal'
  creditCardCreditDetails: {
    holderName: string;
    holderIdentity: string;
    type: {
      name: string;
      value: 0;
    };
    number: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    cardIssuingBank: string;
  };
  wireTransferCreditDetails: {
    beneficiary: string;
    bankName: string;
    bankAddress: string;
    bankAccountNumber: string;
    swiftCode: string;
  };
  webMoneyCreditDetails: {
    email: string;
    number: string;
  };
}
