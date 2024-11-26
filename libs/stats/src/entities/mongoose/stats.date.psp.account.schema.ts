import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PspAccount } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { StatsPspAccountEntity } from '@stats/stats/entities/stats.psp.account.entity';
import { Transfer } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import mongoose, { Document, ObjectId } from 'mongoose';

export type StatsDatePspAccountDocument = StatsDatePspAccount & Document;

@Schema({
  timestamps: true,
})
export class StatsDatePspAccount implements StatsPspAccountEntity {
  conversionChargeback: number;
  conversionChargebackDatabase: number;
  conversionWithdrawal: number;
  conversionWithdrawalDatabase: number;
  id: ObjectId;
  @Prop()
  name: string;
  @Prop()
  slug: string;
  @Prop()
  description: string;
  @Prop()
  searchText: string;
  @Prop({ type: String, enum: PeriodEnum })
  period: PeriodEnum;

  // LEADS
  // # Leads
  @Prop()
  quantityLeads: number;
  // # Leads Database
  @Prop()
  quantityLeadsDatabase: number;
  // $ Leads Total
  @Prop()
  totalLeads: number;
  // $ Leads Total Database
  @Prop()
  totalLeadsDatabase: number;
  // $ Max Total
  @Prop()
  maxTotalLeads: number;
  // $ Max Total Database
  @Prop()
  maxTotalLeadsDatabase: number;
  // $ Min Total
  @Prop()
  minTotalLeads: number;
  // $ Min Total Database
  @Prop()
  minTotalLeadsDatabase: number;
  // $ Average Total
  @Prop()
  averageTotalLeads: number;
  // $ Average Total Database
  @Prop()
  averageTotalLeadsDatabase: number;
  // # FTD
  @Prop()
  quantityFtd: number;
  // # FTD Database
  @Prop()
  quantityFtdDatabase: number;
  // $ FTD Total
  @Prop()
  totalFtd: number;
  // $ FTD Total Database
  @Prop()
  totalFtdDatabase: number;
  // $ Max FTD Total
  @Prop()
  maxTotalFtd: number;
  // $ Max FTD Total Database
  @Prop()
  maxTotalFtdDatabase: number;
  // $ Min FTD Total
  @Prop()
  minTotalFtd: number;
  // $ Min FTD Total Database
  @Prop()
  minTotalFtdDatabase: number;
  // $ Average FTD Total
  @Prop()
  averageTotalFtd: number;
  // $ Average FTD Total Database
  @Prop()
  averageTotalFtdDatabase: number;
  // # CFTD
  @Prop()
  quantityCftd: number;
  // # CFTD Database
  @Prop()
  quantityCftdDatabase: number;
  // $ CFTD Total
  @Prop()
  totalCftd: number;
  // $ CFTD Total Database
  @Prop()
  totalCftdDatabase: number;
  // $ Max CFTD Total
  @Prop()
  maxTotalCftd: number;
  // $ Max CFTD Total Database
  @Prop()
  maxTotalCftdDatabase: number;
  // $ Min CFTD Total
  @Prop()
  minTotalCftd: number;
  // $ Min CFTD Total Database
  @Prop()
  minTotalCftdDatabase: number;
  // $ Average CFTD Total
  @Prop()
  averageTotalCftd: number;
  // $ Average CFTD Total Database
  @Prop()
  averageTotalCftdDatabase: number;
  // # Transfer
  @Prop()
  quantityTransfer: number;
  // # Transfer Database
  @Prop()
  quantityTransferDatabase: number;
  // $ Transfer Total
  @Prop()
  totalTransfer: number;
  // $ Transfer Total Database
  @Prop()
  totalTransferDatabase: number;
  // $ Max Transfer Total
  @Prop()
  maxTotalTransfer: number;
  // $ Max Transfer Total Database
  @Prop()
  maxTotalTransferDatabase: number;
  // $ Min Transfer Total
  @Prop()
  minTotalTransfer: number;
  // $ Min Transfer Total Database
  @Prop()
  minTotalTransferDatabase: number;
  // $ Average Transfer Total
  @Prop()
  averageTotalTransfer: number;
  // $ Average Transfer Total Database
  @Prop()
  averageTotalTransferDatabase: number;
  // # Retention
  @Prop()
  quantityRetention: number;
  // # Retention Database
  @Prop()
  quantityRetentionDatabase: number;
  // $ Retention Total
  @Prop()
  totalRetention: number;
  // $ Retention Total Database
  @Prop()
  totalRetentionDatabase: number;
  // $ Max Retention Total
  @Prop()
  maxTotalRetention: number;
  // $ Max Retention Total Database
  @Prop()
  maxTotalRetentionDatabase: number;
  // $ Min Retention Total
  @Prop()
  minTotalRetention: number;
  // $ Min Retention Total Database
  @Prop()
  minTotalRetentionDatabase: number;
  // $ Average Retention Total
  @Prop()
  averageTotalRetention: number;
  // $ Average Retention Total Database
  @Prop()
  averageTotalRetentionDatabase: number;
  // # Sales
  @Prop()
  quantitySales: number;
  // # Sales Database
  @Prop()
  quantitySalesDatabase: number;
  // $ Sales Total
  @Prop()
  totalSales: number;
  // $ Sales Total Database
  @Prop()
  totalSalesDatabase: number;
  // $ Max Sales Total
  @Prop()
  maxTotalSales: number;
  // $ Max Sales Total Database
  @Prop()
  maxTotalSalesDatabase: number;
  // $ Min Sales Total
  @Prop()
  minTotalSales: number;
  // $ Min Sales Total Database
  @Prop()
  minTotalSalesDatabase: number;
  // $ Average Sales Total
  @Prop()
  averageTotalSales: number;
  // $ Average Sales Total Database
  @Prop()
  averageTotalSalesDatabase: number;
  // # Withdrawal
  @Prop()
  quantityWithdrawal: number;
  // # Withdrawal Database
  @Prop()
  quantityWithdrawalDatabase: number;
  // $ Withdrawal Total
  @Prop()
  totalWithdrawal: number;
  // $ Withdrawal Total Database
  @Prop()
  totalWithdrawalDatabase: number;
  // $ Max Withdrawal Total
  @Prop()
  maxTotalWithdrawal: number;
  // $ Max Withdrawal Total Database
  @Prop()
  maxTotalWithdrawalDatabase: number;
  // $ Min Withdrawal Total
  @Prop()
  minTotalWithdrawal: number;
  // $ Min Withdrawal Total Database
  @Prop()
  minTotalWithdrawalDatabase: number;
  // $ Average Withdrawal Total
  @Prop()
  averageTotalWithdrawal: number;
  // $ Average Withdrawal Total Database
  @Prop()
  averageTotalWithdrawalDatabase: number;
  // # Chargeback
  @Prop()
  quantityChargeback: number;
  // # Chargeback Database
  @Prop()
  quantityChargebackDatabase: number;
  // $ Chargeback Total
  @Prop()
  totalChargeback: number;
  // $ Chargeback Total Database
  @Prop()
  totalChargebackDatabase: number;
  // $ Max Chargeback Total
  @Prop()
  maxTotalChargeback: number;
  // $ Max Chargeback Total Database
  @Prop()
  maxTotalChargebackDatabase: number;
  // $ Min Chargeback Total
  @Prop()
  minTotalChargeback: number;
  // $ Min Chargeback Total Database
  @Prop()
  minTotalChargebackDatabase: number;
  // $ Average Chargeback Total
  @Prop()
  averageTotalChargeback: number;
  // $ Average Chargeback Total Database
  @Prop()
  averageTotalChargebackDatabase: number;
  // # FTD Approved to Affiliate
  @Prop()
  quantityApprovedLead: number;
  // # FTD Approved to Affiliate Database
  @Prop()
  quantityApprovedLeadDatabase: number;
  // $ FTD Approved to Affiliate
  @Prop()
  totalApprovedLead: number;
  // $ FTD Approved to Affiliate Database
  @Prop()
  totalApprovedLeadDatabase: number;
  // $ Max FTD Approved to Affiliate
  @Prop()
  maxTotalApprovedLead: number;
  // $ Max FTD Approved to Affiliate Database
  @Prop()
  maxTotalApprovedLeadDatabase: number;
  // $ Min FTD Approved to Affiliate
  @Prop()
  minTotalApprovedLead: number;
  // $ Min FTD Approved to Affiliate Database
  @Prop()
  minTotalApprovedLeadDatabase: number;
  // Conversion Approved to Affiliate (totalAffiliateFtd / totalLeads)
  @Prop()
  conversionApprovedLead: number;
  // Conversion Approved to Affiliate (totalAffiliateFtdDatabase / totalLeadsDatabase) Database
  @Prop()
  conversionApprovedLeadDatabase: number;
  // % Conversion Total (totalFtd / totalChargeback)
  @Prop()
  conversion: number;
  // % Conversion Total (totalFtdDatabase / totalLeadsDatabase)
  @Prop()
  conversionDatabase: number;
  // % Conversion Cftd (totalCftd / totalLeads)
  @Prop()
  conversionCftd: number;
  // % Conversion Retention (totalRetention / totalChargeback)
  @Prop()
  conversionRetention: number;
  @Prop()
  dateCheck: Date;
  @Prop()
  dateCheckCFTD: Date;
  @Prop()
  dateCheckFTD: Date;
  @Prop()
  dateCheckRetention: Date;
  @Prop()
  dateCheckApprovedAt: Date;
  @Prop()
  dateCheckConfirmedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  sourceType: Category;

  @Prop({ type: String, enum: CountryCodeEnum })
  country: CountryCodeEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' })
  affiliate: Affiliate;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  brand: BusinessUnit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'crms' })
  crm: Crm;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psp_accounts' })
  pspAccount: PspAccount;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psps' })
  psp: Psp;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  department: Category;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }],
  })
  leads: Lead[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transfers' }],
  })
  transfers: Transfer[];

  @Prop({ type: String, enum: OperationTransactionType })
  operationType: OperationTransactionType;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StatsDatePspAccountSchema =
  SchemaFactory.createForClass(StatsDatePspAccount);
