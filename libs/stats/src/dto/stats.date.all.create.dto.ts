import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { PspAccountEntity } from '@psp-account/psp-account/entities/psp-account.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class StatsDateAllCreateDto extends CreateAnyDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  slug: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsEmpty()
  searchText: string;
  @IsNotEmpty()
  @IsEnum(PeriodEnum)
  period: PeriodEnum;
  // LEADS
  // # Leads
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityLeads = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalLeads = 0;
  // $ Max Total
  maxTotalLeads = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  // $ Total
  totalLeads = 0;

  // CFTD
  // # Cftd
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityCftd = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalCftd = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalCftd = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalCftd = 0;

  // FTD
  // # Ftd
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityFtd = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalFtd = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalFtd = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalFtd = 0;

  // RETENTION
  // # Retention
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityRetention = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalRetention = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalRetention = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalRetention = 0;

  // TRANSFER
  // # Transfer
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityTransfer = 0;
  // # Approved Transfer
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedTransfer = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalTransfer = 0;
  // $ Min Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedTransfer = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalTransfer = 0;
  // $ Max Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedTransfer = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalTransfer = 0;
  // $ Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedTransfer = 0;

  // # Deposit
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityDeposit = 0;
  // # Approved Deposit
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedDeposit = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalDeposit = 0;
  // $ Min Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedDeposit = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalDeposit = 0;
  // $ Max Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedDeposit = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalDeposit = 0;
  // $ Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedDeposit = 0;

  // # Credit
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityCredit = 0;
  // # Approved Credit
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedCredit = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalCredit = 0;
  // $ Min Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedCredit = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalCredit = 0;
  // $ Max Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedCredit = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalCredit = 0;
  // $ Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedCredit = 0;

  // # Withdrawal
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityWithdrawal = 0;
  // # Approved Withdrawal
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedWithdrawal = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalWithdrawal = 0;
  // $ Min Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedWithdrawal = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalWithdrawal = 0;
  // $ Max Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedWithdrawal = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalWithdrawal = 0;
  // $ Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedWithdrawal = 0;

  // # Chargeback
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityChargeback = 0;
  // # Approved Chargeback
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedChargeback = 0;
  // $ Min Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalChargeback = 0;
  // $ Min Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedChargeback = 0;
  // $ Max Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalChargeback = 0;
  // $ Max Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedChargeback = 0;
  // $ Total
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalChargeback = 0;
  // $ Total Approved
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedChargeback = 0;

  // Conversion Approved to Affiliate (totalFtd / totalLeads)
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionApprovedLead = 0;
  // % Conversion Total ((totalCftd + totalFtd) / totalDeposit)
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversion = 0;
  // % Conversion Cftd (totalCftd / totalDeposit)
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionCftd = 0;
  // % Conversion Ftd (totalFtd / totalDeposit)
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionFtd = 0;
  // % Conversion Retention (totalRetention / totalSales)
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionRetention = 0;

  // Date to Transfer or Lead
  dateCheck: Date;

  // Lead ID
  @IsOptional()
  @IsMongoId()
  country: CountryCodeEnum;
  @IsOptional()
  @IsMongoId()
  department: CategoryEntity;
  @IsOptional()
  @IsMongoId()
  brand: BusinessUnitEntity;
  crm: CrmEntity;
  @IsOptional()
  @IsMongoId()
  affiliate: AffiliateEntity;
  @IsOptional()
  @IsMongoId()
  affiliateGroup: GroupEntity;
  @IsOptional()
  @IsMongoId()
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
