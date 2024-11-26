import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Group } from '@group/group/entities/mongoose/group.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { Status } from '@status/status/entities/mongoose/status.schema';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type PspDocument = Psp & Document;

@Schema({
  timestamps: true,
})
export class Psp extends PspEntity {
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
  hasChecked: boolean;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'crms' }] })
  crms: Crm[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }] })
  groups: Group[];

  /* @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lead_psps' }] })
  leadsUsing: LeadPsp[]; */

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  businessUnit: BusinessUnit;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }] })
  blackListCountries: Category[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }] })
  blackListAffiliates: Affiliate[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' }],
  })
  blackListBrands: BusinessUnit[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }] })
  whiteListCountries: Category[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }] })
  whiteListAffiliates: Affiliate[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' }],
  })
  whiteListBrands: BusinessUnit[];
}

export const PspSchema = SchemaFactory.createForClass(Psp);
