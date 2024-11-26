export class CreatePaymentTransactionLeverateRequestDto {
  constructor(data?: CreatePaymentTransactionLeverateRequestDto) {
    Object.assign(this, data ?? {});
  }
  accountId: string;
  tpAccountId: string;
  externalTransactionId: string;
  cardAcquirersReference: string;
  amount: number;
}
