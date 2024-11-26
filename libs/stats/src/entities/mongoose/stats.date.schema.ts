import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Group } from '@group/group/entities/mongoose/group.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PspAccount } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Transfer } from '@transfer/transfer/entities/mongoose/transfer.schema';
import mongoose, { Document, ObjectId } from 'mongoose';
import { StatsDateEntity } from '../stats.date.entity';

export type StatsDateDocument = StatsDate & Document;

@Schema({
  timestamps: true,
})
export class StatsDate implements StatsDateEntity {
  id: string;
  _id: ObjectId;
  @Prop()
  name: string;
  @Prop()
  slug: string;
  @Prop()
  description: string;
  @Prop()
  searchText: string;
  @Prop()
  period: PeriodEnum;

  // LEADS
  // # Leads
  @Prop()
  quantityLeads?: number;
  // $ Min Total
  @Prop()
  minTotalLeads?: number;
  // $ Max Total
  @Prop()
  maxTotalLeads?: number;
  // $ Total
  @Prop()
  totalLeads?: number;
  // $ Average Total
  @Prop()
  averageTotalLeads?: number;

  // CFTD
  // # Cftd
  @Prop()
  quantityCftd?: number;
  // $ Min Total
  @Prop()
  minTotalCftd?: number;
  // $ Max Total
  @Prop()
  maxTotalCftd?: number;
  // $ Total
  @Prop()
  totalCftd?: number;
  // $ Average Total
  @Prop()
  averageTotalCftd?: number;

  // FTD
  // # Ftd
  @Prop()
  quantityFtd?: number;
  // $ Min Total
  @Prop()
  minTotalFtd?: number;
  // $ Max Total
  @Prop()
  maxTotalFtd?: number;
  // $ Total
  @Prop()
  totalFtd?: number;
  // $ Average Total
  @Prop()
  averageTotalFtd?: number;

  // RETENTION
  // # Retention
  @Prop()
  quantityRetention?: number;
  // $ Min Total
  @Prop()
  minTotalRetention?: number;
  // $ Max Total
  @Prop()
  maxTotalRetention?: number;
  // $ Total
  @Prop()
  totalRetention?: number;
  // $ Average Total
  @Prop()
  averageTotalRetention?: number;

  // TRANSFER
  // # Transfer
  @Prop()
  quantityTransfer?: number;
  // # Approved Transfer
  @Prop()
  quantityApprovedTransfer?: number;
  // $ Min Total
  @Prop()
  minTotalTransfer?: number;
  // $ Min Total
  @Prop()
  minTotalApprovedTransfer?: number;
  // $ Max Total
  @Prop()
  maxTotalTransfer?: number;
  // $ Max Total
  @Prop()
  maxTotalApprovedTransfer?: number;
  // $ Total
  @Prop()
  totalTransfer?: number;
  // $ Total
  @Prop()
  totalApprovedTransfer?: number;
  // $ Average Total
  @Prop()
  averageTotalTransfer?: number;
  // $ Average Total
  @Prop()
  averageTotalApprovedTransfer?: number;

  // # Deposit
  @Prop()
  quantityDeposit?: number;
  // # Approved Deposit
  @Prop()
  quantityApprovedDeposit?: number;
  // $ Min Total
  @Prop()
  minTotalDeposit?: number;
  // $ Min Total
  @Prop()
  minTotalApprovedDeposit?: number;
  // $ Max Total
  @Prop()
  maxTotalDeposit?: number;
  // $ Max Total
  @Prop()
  maxTotalApprovedDeposit?: number;
  // $ Total
  @Prop()
  totalDeposit?: number;
  // $ Total
  @Prop()
  totalApprovedDeposit?: number;
  // $ Average Total
  @Prop()
  averageTotalDeposit?: number;
  // $ Average Total
  @Prop()
  averageTotalApprovedDeposit?: number;

  // # Credit
  @Prop()
  quantityCredit?: number;
  // # Approved Credit
  @Prop()
  quantityApprovedCredit?: number;
  // $ Min Total
  @Prop()
  minTotalCredit?: number;
  // $ Min Total
  @Prop()
  minTotalApprovedCredit?: number;
  // $ Max Total
  @Prop()
  maxTotalCredit?: number;
  // $ Max Total
  @Prop()
  maxTotalApprovedCredit?: number;
  // $ Total
  @Prop()
  totalCredit?: number;
  // $ Total
  @Prop()
  totalApprovedCredit?: number;
  // $ Average Total
  @Prop()
  averageTotalCredit?: number;
  // $ Average Total
  @Prop()
  averageTotalApprovedCredit?: number;

  // # Withdrawal
  @Prop()
  quantityWithdrawal?: number;
  // # Approved Withdrawal
  @Prop()
  quantityApprovedWithdrawal?: number;
  // $ Min Total
  @Prop()
  minTotalWithdrawal?: number;
  // $ Min Total
  @Prop()
  minTotalApprovedWithdrawal?: number;
  // $ Max Total
  @Prop()
  maxTotalWithdrawal?: number;
  // $ Max Total
  @Prop()
  maxTotalApprovedWithdrawal?: number;
  // $ Total
  @Prop()
  totalWithdrawal?: number;
  // $ Total
  @Prop()
  totalApprovedWithdrawal?: number;
  // $ Average Total
  @Prop()
  averageTotalWithdrawal?: number;
  // $ Average Total
  @Prop()
  averageTotalApprovedWithdrawal?: number;

  // # Chargeback
  @Prop()
  quantityChargeback?: number;
  // # Approved Chargeback
  @Prop()
  quantityApprovedChargeback?: number;
  // $ Min Total
  @Prop()
  minTotalChargeback?: number;
  // $ Min Total
  @Prop()
  minTotalApprovedChargeback?: number;
  // $ Max Total
  @Prop()
  maxTotalChargeback?: number;
  // $ Max Total
  @Prop()
  maxTotalApprovedChargeback?: number;
  // $ Total
  @Prop()
  totalChargeback?: number;
  // $ Total
  @Prop()
  totalApprovedChargeback?: number;
  // $ Average Total
  @Prop()
  averageTotalChargeback?: number;
  // $ Average Total
  @Prop()
  averageTotalApprovedChargeback?: number;

  // Conversion Approved to Affiliate (totalFtd / totalLeads)
  @Prop()
  conversionApprovedLead?: number;
  // % Conversion Total ((totalCftd + totalFtd) / totalDeposit)
  @Prop()
  conversion?: number;
  // % Conversion Cftd (totalCftd / totalDeposit)
  @Prop()
  conversionCftd?: number;
  // % Conversion Ftd (totalFtd / totalDeposit)
  @Prop()
  conversionFtd?: number;
  // % Conversion Retention (totalRetention / totalSales)
  @Prop()
  conversionRetention?: number;

  // Date to Transfer or Lead
  @Prop()
  dateCheck: Date;

  // Lead ID
  @Prop({ type: String, enum: CountryCodeEnum })
  country: CountryCodeEnum;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  department: Category;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  brand: BusinessUnit;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'crms' })
  crm: Crm;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' })
  affiliate: Affiliate;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'groups' })
  affiliateGroup: Group;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'groups' })
  integrationGroup: Group;

  // Transfer ID
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psps' })
  psp: Psp;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psp_accounts' })
  pspAccount: PspAccount;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  sourceType: Category;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }],
  })
  leads: Lead[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transfers' }],
  })
  transfers: Transfer[];

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const StatsDateSchema = SchemaFactory.createForClass(StatsDate);
