import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { PspAccountEntity } from '@psp-account/psp-account/entities/psp-account.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { ObjectId } from 'mongoose';

export class StatsDateEntity {
  id: string;
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  period: PeriodEnum;

  // LEADS
  // # Leads
  quantityLeads?: number;
  // $ Min Total
  minTotalLeads?: number;
  // $ Max Total
  maxTotalLeads?: number;
  // $ Total
  totalLeads?: number;

  // CFTD
  // # Cftd
  quantityCftd?: number;
  // $ Min Total
  minTotalCftd?: number;
  // $ Max Total
  maxTotalCftd?: number;
  // $ Total
  totalCftd?: number;

  // FTD
  // # Ftd
  quantityFtd?: number;
  // $ Min Total
  minTotalFtd?: number;
  // $ Max Total
  maxTotalFtd?: number;
  // $ Total
  totalFtd?: number;

  // RETENTION
  // # Retention
  quantityRetention?: number;
  // $ Min Total
  minTotalRetention?: number;
  // $ Max Total
  maxTotalRetention?: number;
  // $ Total
  totalRetention?: number;

  // TRANSFER
  // # Transfer
  quantityTransfer?: number;
  // # Approved Transfer
  quantityApprovedTransfer?: number;
  // $ Min Total
  minTotalTransfer?: number;
  // $ Min Total
  minTotalApprovedTransfer?: number;
  // $ Max Total
  maxTotalTransfer?: number;
  // $ Max Total
  maxTotalApprovedTransfer?: number;
  // $ Total
  totalTransfer?: number;
  // $ Total
  totalApprovedTransfer?: number;

  // # Deposit
  quantityDeposit?: number;
  // # Approved Deposit
  quantityApprovedDeposit?: number;
  // $ Min Total
  minTotalDeposit?: number;
  // $ Min Total
  minTotalApprovedDeposit?: number;
  // $ Max Total
  maxTotalDeposit?: number;
  // $ Max Total
  maxTotalApprovedDeposit?: number;
  // $ Total
  totalDeposit?: number;
  // $ Total
  totalApprovedDeposit?: number;

  // # Credit
  quantityCredit?: number;
  // # Approved Credit
  quantityApprovedCredit?: number;
  // $ Min Total
  minTotalCredit?: number;
  // $ Min Total
  minTotalApprovedCredit?: number;
  // $ Max Total
  maxTotalCredit?: number;
  // $ Max Total
  maxTotalApprovedCredit?: number;
  // $ Total
  totalCredit?: number;
  // $ Total
  totalApprovedCredit?: number;

  // # Withdrawal
  quantityWithdrawal?: number;
  // # Approved Withdrawal
  quantityApprovedWithdrawal?: number;
  // $ Min Total
  minTotalWithdrawal?: number;
  // $ Min Total
  minTotalApprovedWithdrawal?: number;
  // $ Max Total
  maxTotalWithdrawal?: number;
  // $ Max Total
  maxTotalApprovedWithdrawal?: number;
  // $ Total
  totalWithdrawal?: number;
  // $ Total
  totalApprovedWithdrawal?: number;

  // # Chargeback
  quantityChargeback?: number;
  // # Approved Chargeback
  quantityApprovedChargeback?: number;
  // $ Min Total
  minTotalChargeback?: number;
  // $ Min Total
  minTotalApprovedChargeback?: number;
  // $ Max Total
  maxTotalChargeback?: number;
  // $ Max Total
  maxTotalApprovedChargeback?: number;
  // $ Total
  totalChargeback?: number;
  // $ Total
  totalApprovedChargeback?: number;

  // Conversion Approved to Affiliate (totalFtd / totalLeads)
  conversionApprovedLead?: number;
  // % Conversion Total ((totalCftd + totalFtd) / totalDeposit)
  conversion?: number;
  // % Conversion Cftd (totalCftd / totalDeposit)
  conversionCftd?: number;
  // % Conversion Ftd (totalFtd / totalDeposit)
  conversionFtd?: number;
  // % Conversion Retention (totalRetention / totalSales)
  conversionRetention?: number;

  // Date to Transfer or Lead
  dateCheck: Date;

  // Lead ID
  country: CountryCodeEnum;
  department: CategoryEntity;
  brand: BusinessUnitEntity;
  crm: CrmEntity;
  affiliate: AffiliateEntity;
  affiliateGroup: GroupEntity;
  integrationGroup: GroupEntity;

  // Transfer ID
  psp: PspEntity;
  pspAccount: PspAccountEntity;

  sourceType: CategoryEntity;
  leads: LeadEntity[];
  transfers: TransferEntity[];

  createdAt: Date;
  updatedAt: Date;
}
