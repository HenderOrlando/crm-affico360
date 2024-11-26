import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { PspAccountEntity } from '@psp-account/psp-account/entities/psp-account.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatsInterface } from '@stats/stats/entities/stats.interface';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import { ObjectId } from 'mongoose';

export class StatsPspAccountEntity implements StatsInterface {
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
  // Conversion Approved to Affiliate (totalAffiliateFtd / totalLeads)
  conversionApprovedLead: number;
  // Conversion Approved to Affiliate (totalAffiliateFtdDatabase / totalLeadsDatabase) Database
  conversionApprovedLeadDatabase: number;
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

  sourceType: CategoryEntity;
  country: CountryCodeEnum;
  affiliate: AffiliateEntity;
  brand: BusinessUnitEntity;
  crm: CrmEntity;
  pspAccount: PspAccountEntity;
  psp: PspEntity;
  department: CategoryEntity;
  leads: LeadEntity[];
  transfers: TransferEntity[];
  operationType: OperationTransactionType;
  createdAt: Date;
  updatedAt: Date;
}
