import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import {
  DynamicAttributeInfoLeverateDto,
  DynamicAttributeTypeLeverateEnum,
} from './dynamic.attribute.info.leverate.dto';
import { MonetaryTransactionRequestInfoLeverateDto } from './monetary.transaction.info.leverate.dto';

export class MonetaryTransactionRequestLeverateDto {
  constructor(transfer?: TransferInterface) {
    switch (transfer.operationType) {
      case OperationTransactionType.deposit:
        this.$type = 'DepositRequest';
        break;
      case OperationTransactionType.withdrawal:
        //this.$type = 'withdrawalRequest';
        this.$type = 'WithdrawalMonetaryTransactionRequest';
        break;
      case OperationTransactionType.credit:
        this.$type = 'CreditRequest';
        break;
    }
    this.monetaryTransactionRequestInfo = {
      tradingPlatformAccountId: transfer.leadTradingPlatformId,
      additionalInfo: transfer.description,
      amount: transfer.amount,
      transactionReference: transfer._id,
      internalComment: transfer.pspAccount?.name ?? 'NAN',
      paymentInfo: {
        $type: 'CashPaymentInfo',
      },
      //originalAmount: transfer.amount,
    } as unknown as MonetaryTransactionRequestInfoLeverateDto;
    this.additionalAttributes = [];
    this.additionalAttributes.push(
      new DynamicAttributeInfoLeverateDto({
        dynamicAttributeType: DynamicAttributeTypeLeverateEnum.PICK_LIST,
        name: 'lv_methodofpayment',
        value: 1,
      } as DynamicAttributeInfoLeverateDto),
    );
    this.additionalAttributes.push(
      new DynamicAttributeInfoLeverateDto({
        dynamicAttributeType: DynamicAttributeTypeLeverateEnum.STRING,
        name: 'lv_internalcomment',
        value:
          transfer.pspAccount?.name ??
          transfer.descriptionStatusPayment ??
          'NAN',
      } as DynamicAttributeInfoLeverateDto),
    );
    this.additionalAttributes.push(
      new DynamicAttributeInfoLeverateDto({
        dynamicAttributeType: DynamicAttributeTypeLeverateEnum.BIT,
        name: 'lv_managementapproval',
        value: 'true',
      } as DynamicAttributeInfoLeverateDto),
    );
    this.additionalAttributes.push(
      new DynamicAttributeInfoLeverateDto({
        dynamicAttributeType: DynamicAttributeTypeLeverateEnum.STRING,
        name: 'lv_name',
        value: this.$type.replace('Request', ''),
      } as DynamicAttributeInfoLeverateDto),
    );
    this.shouldAutoApprove = true;
    this.updateTPOnApprove = true;
  }
  monetaryTransactionRequestInfo: MonetaryTransactionRequestInfoLeverateDto;
  shouldAutoApprove: boolean;
  updateTPOnApprove: boolean;
  isCancellationTransaction: boolean;
  blockDuplicatedReference: boolean;
  additionalAttributes: DynamicAttributeInfoLeverateDto[];
  $type: string;
}
/**
 * MOISES REQUEST
  {
    "$type": "DepositRequest",
    "monetaryTransactionRequestInfo": {
      "tradingPlatformAccountId": "FE987982-0206-EE11-B4F9-005056B1CC58",
      "amount": 1,
      "transactionReference": "2145316",
      "internalComment": "NAN",
      "paymentInfo": {
        "$type": "CashPaymentInfo"
      }
    },
    "additionalAttributes": [
      {
        "dynamicAttributeType": "Picklist",
        "name": "lv_methodofpayment",
        "value": 1
      },
      {
        "dynamicAttributeType": "String",
        "name": "lv_internalcomment",
        "value": "NAN"
      },
      {
        "dynamicAttributeType": "Bit",
        "name": "lv_managementapproval",
        "value": "true"
      },
      {
        "dynamicAttributeType": "String",
        "name": "lv_name",
        "value": "Deposit"
      }
    ],
    "shouldAutoApprove": true,
    "updateTPOnApprove": true
  }
 */
