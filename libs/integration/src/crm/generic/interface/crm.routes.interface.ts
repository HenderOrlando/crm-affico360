export interface CrmRoutesInterface {
  generateApiKey?: string;
  // Affiliate
  affiliateTrackVisit?: string;
  affiliateRegisterUser?: string;
  affiliateRegisterLead?: string;
  affiliateAssignLead?: string;
  affiliateGetUser?: string;
  affiliateGetUsers?: string;
  affiliateSyncUserNote?: string;
  affiliateRegenerateUserAutoLoginUrl?: string;
  affiliateGetDeposit?: string;
  affiliateSyncUserTransaction?: string;
  affiliateGetStats?: string;
  affiliateGetSalesStatuses?: string;
  // Monetary Transaction
  crmAccountsDetailsLead?: string;
  crmGenerateToken?: string;
  crmAccountDetails?: string;
  crmCreateWithdrawalRequest?: string;
  crmCreateCreaditCardDepositRequest?: string;
  crmCreateMonetaryTransactionRequest?: string;
  crmCreateWithdrawalCancellationTransactionStatusRequest?: string;
  crmGetMonetaryTransactionPerTPAccountRequest?: string;
  // Payment Transaction
  crmCreatePaymentTransaction?: string;
  crmUpdatePaymentTransaction?: string;
}
