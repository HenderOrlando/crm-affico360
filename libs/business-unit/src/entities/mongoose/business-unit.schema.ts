import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { Category } from '@category/category/entities/mongoose/category.schema';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { Traffic } from '@traffic/traffic/entities/mongoose/traffic.schema';
import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type BusinessUnitDocument = BusinessUnit & Document;

@Schema({
  timestamps: true,
})
export class BusinessUnit extends BusinessUnitEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  idCashier: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

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
  department: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'crms' })
  currentCrm: Crm;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'crms' }] })
  crmList: Crm[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'psps' }] })
  pspList: Psp[];

  /* @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }] })
  affiliates: Affiliate[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }] })
  leads: Lead[]; */

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'traffics' }] })
  traffics: Traffic[];
}

export const BusinessUnitSchema = SchemaFactory.createForClass(BusinessUnit);
