import { PaymentResponseDto } from '@integration/integration/crm/generic/dto/payment.response.dto';

export class InfoResponseLeverateDto implements PaymentResponseDto {
  constructor(data?: InfoResponseLeverateDto) {
    Object.assign(this, data ?? {});
  }
  requestId: string;
  code: CodeResponseLeverateEnum;
  message: string;
}

export enum CodeResponseLeverateEnum {
  Success = 'Success',
  UserAlreadyExist = 'UserAlreadyExist',
  AccountNotExist = 'AccountNotExist',
  TradingPlatformAccountNotExist = 'TradingPlatformAccountNotExist',
  TradingPlatformNotExist = 'TradingPlatformNotExist',
  ArgumentsValidationFailed = 'ArgumentsValidationFailed',
  NotEnoughMoney = 'NotEnoughMoney',
  DepositForDemoAccountNotAllowed = 'DepositForDemoAccountNotAllowed',
  WithdrawalForDemoAccountNotAllowed = 'WithdrawalForDemoAccountNotAllowed',
  MonetaryTransactionAlreadyApproved = 'MonetaryTransactionAlreadyApproved',
  RequiredFieldIsEmpty = 'RequiredFieldIsEmpty',
  InvalidCRMConfiguration = 'InvalidCRMConfiguration',
  DeletionFailed = 'DeletionFailed',
  SuccessWithDuplicates = 'SuccessWithDuplicates',
  FailedToCreateTransaction = 'FailedToCreateTransaction',
  SuccessWithIssues = 'SuccessWithIssues',
  ProblemWithTransactionApproval = 'ProblemWithTransactionApproval',
  FailedCreatingUserOnTradingPlatform = 'FailedCreatingUserOnTradingPlatform',
  AccountRegistrationFailed = 'AccountRegistrationFailed',
  SuccessWithClientVerificationIssues = 'SuccessWithClientVerificationIssues',
  SuccessWithDuplicatesAndIssues = 'SuccessWithDuplicatesAndIssues',
  FailedGettingAccountDetails = 'FailedGettingAccountDetails',
  Failed = 'Failed',
  MultipleResultFound = 'MultipleResultFound',
}
