import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { LeadInterface } from '@lead/lead/entities/lead.interface';
import { PspAccountInterface } from '@psp-account/psp-account/entities/psp-account.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import { ObjectId } from 'mongoose';

export interface StatsInterface {
  id: ObjectId;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  period: PeriodEnum;

  // LEADS
  // # Leads
  quantityLeads: number;
  // # Leads Database
  quantityLeadsDatabase: number;
  // $ Leads Total
  totalLeads: number;
  // $ Leads Total Database
  totalLeadsDatabase: number;
  // $ Max Total
  maxTotalLeads: number;
  // $ Max Total Database
  maxTotalLeadsDatabase: number;
  // $ Min Total
  minTotalLeads: number;
  // $ Min Total Database
  minTotalLeadsDatabase: number;
  // $ Average Total
  averageTotalLeads: number;
  // $ Average Total Database
  averageTotalLeadsDatabase: number;
  // # FTD
  quantityFtd: number;
  // # FTD Database
  quantityFtdDatabase: number;
  // $ FTD Total
  totalFtd: number;
  // $ FTD Total Database
  totalFtdDatabase: number;
  // $ Max FTD Total
  maxTotalFtd: number;
  // $ Max FTD Total Database
  maxTotalFtdDatabase: number;
  // $ Min FTD Total
  minTotalFtd: number;
  // $ Min FTD Total Database
  minTotalFtdDatabase: number;
  // $ Average FTD Total
  averageTotalFtd: number;
  // $ Average FTD Total Database
  averageTotalFtdDatabase: number;
  // # CFTD
  quantityCftd: number;
  // # CFTD Database
  quantityCftdDatabase: number;
  // $ CFTD Total
  totalCftd: number;
  // $ CFTD Total Database
  totalCftdDatabase: number;
  // $ Max CFTD Total
  maxTotalCftd: number;
  // $ Max CFTD Total Database
  maxTotalCftdDatabase: number;
  // $ Min CFTD Total
  minTotalCftd: number;
  // $ Min CFTD Total Database
  minTotalCftdDatabase: number;
  // $ Average CFTD Total
  averageTotalCftd: number;
  // $ Average CFTD Total Database
  averageTotalCftdDatabase: number;
  // # Transfer
  quantityTransfer: number;
  // # Transfer Database
  quantityTransferDatabase: number;
  // $ Transfer Total
  totalTransfer: number;
  // $ Transfer Total Database
  totalTransferDatabase: number;
  // $ Max Transfer Total
  maxTotalTransfer: number;
  // $ Max Transfer Total Database
  maxTotalTransferDatabase: number;
  // $ Min Transfer Total
  minTotalTransfer: number;
  // $ Min Transfer Total Database
  minTotalTransferDatabase: number;
  // $ Average Transfer Total
  averageTotalTransfer: number;
  // $ Average Transfer Total Database
  averageTotalTransferDatabase: number;
  // # Retention
  quantityRetention: number;
  // # Retention Database
  quantityRetentionDatabase: number;
  // $ Retention Total
  totalRetention: number;
  // $ Retention Total Database
  totalRetentionDatabase: number;
  // $ Max Retention Total
  maxTotalRetention: number;
  // $ Max Retention Total Database
  maxTotalRetentionDatabase: number;
  // $ Min Retention Total
  minTotalRetention: number;
  // $ Min Retention Total Database
  minTotalRetentionDatabase: number;
  // $ Average Retention Total
  averageTotalRetention: number;
  // $ Average Retention Total Database
  averageTotalRetentionDatabase: number;
  // # Sales
  quantitySales: number;
  // # Sales Database
  quantitySalesDatabase: number;
  // $ Sales Total
  totalSales: number;
  // $ Sales Total Database
  totalSalesDatabase: number;
  // $ Max Sales Total
  maxTotalSales: number;
  // $ Max Sales Total Database
  maxTotalSalesDatabase: number;
  // $ Min Sales Total
  minTotalSales: number;
  // $ Min Sales Total Database
  minTotalSalesDatabase: number;
  // $ Average Sales Total
  averageTotalSales: number;
  // $ Average Sales Total Database
  averageTotalSalesDatabase: number;
  // # Chargebacks to Affiliate
  quantityChargeback: number;
  // # Chargebacks to Affiliate Database
  quantityChargebackDatabase: number;
  // $ Chargebacks to Affiliate
  totalChargeback: number;
  // $ Chargebacks to Affiliate Database
  totalChargebackDatabase: number;
  // $ Max FTD Chargebacks to Affiliate
  maxTotalChargeback: number;
  // $ Max FTD Chargebacks to Affiliate Database
  maxTotalChargebackDatabase: number;
  // $ Min FTD Chargebacks to Affiliate
  minTotalChargeback: number;
  // $ Min FTD Chargebacks to Affiliate Database
  minTotalChargebackDatabase: number;
  // # Withdrawals to Affiliate
  quantityWithdrawal: number;
  // # Withdrawals to Affiliate Database
  quantityWithdrawalDatabase: number;
  // $ Withdrawals to Affiliate
  totalWithdrawal: number;
  // $ Withdrawals to Affiliate Database
  totalWithdrawalDatabase: number;
  // $ Max FTD Withdrawals to Affiliate
  maxTotalWithdrawal: number;
  // $ Max FTD Withdrawals to Affiliate Database
  maxTotalWithdrawalDatabase: number;
  // $ Min FTD Withdrawals to Affiliate
  minTotalWithdrawal: number;
  // $ Min FTD Withdrawals to Affiliate Database
  minTotalWithdrawalDatabase: number;
  // # FTD Approved to Affiliate
  quantityApprovedLead: number;
  // # FTD Approved to Affiliate Database
  quantityApprovedLeadDatabase: number;
  // $ FTD Approved to Affiliate
  totalApprovedLead: number;
  // $ FTD Approved to Affiliate Database
  totalApprovedLeadDatabase: number;
  // $ Max FTD Approved to Affiliate
  maxTotalApprovedLead: number;
  // $ Max FTD Approved to Affiliate Database
  maxTotalApprovedLeadDatabase: number;
  // $ Min FTD Approved to Affiliate
  minTotalApprovedLead: number;
  // $ Min FTD Approved to Affiliate Database
  minTotalApprovedLeadDatabase: number;
  // % Conversion Total (totalFtd / totalSales)
  conversion: number;
  // % Conversion Total (totalFtdDatabase / totalLeadsDatabase)
  conversionDatabase: number;
  // % Conversion Cftd (totalCftd / totalSales)
  conversionCftd: number;
  // % Conversion Retention (totalRetention / totalSales)
  conversionRetention: number;
  dateCheck: Date;
  dateCheckCFTD: Date;
  dateCheckFTD: Date;
  dateCheckRetention: Date;
  dateCheckApprovedAt: Date;
  dateCheckConfirmedAt: Date;

  sourceType: CategoryInterface;
  country: CountryCodeEnum;
  affiliate: AffiliateInterface;
  brand: BusinessUnitInterface;
  crm: CrmInterface;
  pspAccount: PspAccountInterface;
  psp: PspInterface;
  department: CategoryInterface;
  leads: LeadInterface[];
  transfers: TransferInterface[];
  operationType: OperationTransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export const StatsPropertiesRelations = [
  'sourceType',
  'country',
  'affiliate',
  'brand',
  'crm',
  'pspAccount',
  'psp',
  'department',
  'leads',
  'transfers',
];

export const StatsPropertiesBasic = [
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'period',
  'quantityLeads',
  'quantityLeadsDatabase',
  'totalLeads',
  'totalLeadsDatabase',
  'maxTotalLeads',
  'maxTotalLeadsDatabase',
  'minTotalLeads',
  'minTotalLeadsDatabase',
  'averageTotalLeads',
  'averageTotalLeadsDatabase',
  'quantityFtd',
  'quantityFtdDatabase',
  'totalFtd',
  'totalFtdDatabase',
  'maxTotalFtd',
  'maxTotalFtdDatabase',
  'minTotalFtd',
  'minTotalFtdDatabase',
  'averageTotalFtd',
  'averageTotalFtdDatabase',
  'quantityCftd',
  'quantityCftdDatabase',
  'totalCftd',
  'totalCftdDatabase',
  'maxTotalCftd',
  'maxTotalCftdDatabase',
  'minTotalCftd',
  'minTotalCftdDatabase',
  'averageTotalCftd',
  'averageTotalCftdDatabase',
  'quantityTransfer',
  'quantityTransferDatabase',
  'totalTransfer',
  'totalTransferDatabase',
  'maxTotalTransfer',
  'maxTotalTransferDatabase',
  'minTotalTransfer',
  'minTotalTransferDatabase',
  'averageTotalTransfer',
  'averageTotalTransferDatabase',
  'quantityRetention',
  'quantityRetentionDatabase',
  'totalRetention',
  'totalRetentionDatabase',
  'maxTotalRetention',
  'maxTotalRetentionDatabase',
  'minTotalRetention',
  'minTotalRetentionDatabase',
  'averageTotalRetention',
  'averageTotalRetentionDatabase',
  'quantitySales',
  'quantitySalesDatabase',
  'totalSales',
  'totalSalesDatabase',
  'maxTotalSales',
  'maxTotalSalesDatabase',
  'minTotalSales',
  'minTotalSalesDatabase',
  'averageTotalSales',
  'averageTotalSalesDatabase',
  'quantityChargeback',
  'quantityChargebackDatabase',
  'totalChargeback',
  'totalChargebackDatabase',
  'maxTotalChargeback',
  'maxTotalChargebackDatabase',
  'minTotalChargeback',
  'minTotalChargebackDatabase',
  'quantityWithdrawal',
  'quantityWithdrawalDatabase',
  'totalWithdrawal',
  'totalWithdrawalDatabase',
  'maxTotalWithdrawal',
  'maxTotalWithdrawalDatabase',
  'minTotalWithdrawal',
  'minTotalWithdrawalDatabase',
  'quantityApprovedLead',
  'quantityApprovedLeadDatabase',
  'totalApprovedLead',
  'totalApprovedLeadDatabase',
  'maxTotalApprovedLead',
  'maxTotalApprovedLeadDatabase',
  'minTotalApprovedLead',
  'minTotalApprovedLeadDatabase',
  'conversion',
  'conversionDatabase',
  'conversionCftd',
  'conversionRetention',
  'dateCheck',
  'dateCheckCFTD',
  'dateCheckFTD',
  'dateCheckRetention',
  'dateCheckApprovedAt',
  'dateCheckConfirmedAt',
];
