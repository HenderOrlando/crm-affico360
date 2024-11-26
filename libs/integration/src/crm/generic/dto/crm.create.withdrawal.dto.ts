import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';

export class CrmCreateWithdrawalDto {
  constructor(transfer: TransferInterface) {
    Object.assign(this, transfer);
  }
  accountId: string;
  caseTitle: string;
  description: string;
  tradingPlatformAccountName: string;
  amount: 0;
  currencyId: string;
  withdrawalMethod: string; // 'Internal'
  creditCardWithdrawalDetails: {
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
  wireTransferWithdrawalDetails: {
    beneficiary: string;
    bankName: string;
    bankAddress: string;
    bankAccountNumber: string;
    swiftCode: string;
  };
  webMoneyWithdrawalDetails: {
    email: string;
    number: string;
  };
}
