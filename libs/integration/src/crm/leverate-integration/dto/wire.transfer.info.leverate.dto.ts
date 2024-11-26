export class WireTransferInfoLeverateDto {
  constructor(data?: WireTransferInfoLeverateDto) {
    Object.assign(this, data ?? {});
  }
  beneficiary: string;
  bankName: string;
  bankAddress: string;
  bankAccountNumber: string;
  swiftCode: string;
}
