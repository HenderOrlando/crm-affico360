import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { User } from '@user/user/entities/mongoose/user.schema';
import mongoose, { Document, ObjectId } from 'mongoose';
import { PspAccountEntity } from '../psp-account.entity';
import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';

export type PspAccountDocument = PspAccount & Document;

@Schema({
  timestamps: true,
})
export class PspAccount extends PspAccountEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  idCashier: string;

  @Prop()
  searchText: string;

  @Prop()
  urlApi: string;

  @Prop()
  urlSandbox: string;

  @Prop()
  urlDashboard: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psps' })
  psp: Psp;

  @Prop()
  token: string;

  @Prop()
  accountId: string;

  @Prop()
  apiKey: string;

  @Prop()
  publicKey: string;

  @Prop()
  privateKey: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  urlRedirectToReceiveShortener: string;

  @Prop()
  quantityWithdrawal: number;

  @Prop()
  totalWithdrawal: number;

  @Prop()
  quantityPayments: number;

  @Prop()
  quantityApprovedPayments: number;

  @Prop()
  quantityRejectedPayments: number;

  @Prop()
  totalPayments: number;

  @Prop()
  totalApprovedPayments: number;

  @Prop()
  totalRejectedPayments: number;

  @Prop()
  approvedPercent: number;

  @Prop()
  rejectedPercent: number;

  @Prop()
  minDeposit: number;

  @Prop()
  maxDeposit: number;

  @Prop()
  timeoutToReceive: number;

  @Prop()
  hasChecked: boolean;

  @Prop()
  isRecurrent: boolean;

  @Prop()
  quantityLeads: number;
  @Prop()
  totalLeads: number;
  @Prop()
  quantityFtd: number;
  @Prop()
  totalFtd: number;
  @Prop()
  quantityCftd: number;
  @Prop()
  totalCftd: number;
  @Prop()
  totalConversion: number;
  @Prop()
  quantityAffiliateFtd: number;
  @Prop()
  totalAffiliateFtd: number;
  @Prop()
  totalAffiliateConversion: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  bank: Category;

  // Department
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  department: Category;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }] })
  blackListCountries: Category[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' }],
  })
  blackListBrands: BusinessUnit[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }],
  })
  blackListAffiliates: Affiliate[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }] })
  whiteListCountries: Category[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' }],
  })
  whiteListBrands: BusinessUnit[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }],
  })
  whiteListAffiliates: Affiliate[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  creator: User;
}

export const PspAccountSchema = SchemaFactory.createForClass(PspAccount);
