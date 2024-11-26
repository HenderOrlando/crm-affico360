import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { Group } from '@group/group/entities/mongoose/group.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { Traffic } from '@traffic/traffic/entities/mongoose/traffic.schema';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type CrmDocument = Crm & Document;

@Schema({
  timestamps: true,
})
export class Crm extends CrmEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop()
  url: string;

  @Prop()
  token: string;

  @Prop()
  expTimeToken: Date;

  @Prop()
  clientZone: string;

  @Prop()
  buOwnerIdCrm: string;

  @Prop()
  tradingPlatformIdCrm: string;

  @Prop()
  organizationCrm: string;

  @Prop()
  idCrm: string;

  @Prop()
  secretCrm: string;

  @Prop()
  userCrm: string;

  @Prop()
  passwordCrm: string;

  @Prop({ default: 0 })
  quantityLeads: number;

  @Prop({ default: 0 })
  totalLeads: number;

  @Prop({ default: 0 })
  quantityFtd: number;

  @Prop({ default: 0 })
  totalFtd: number;

  @Prop({ default: 0 })
  quantityCftd: number;

  @Prop({ default: 0 })
  totalCftd: number;

  @Prop({ default: 0 })
  totalConversion: number;

  @Prop({ default: 0 })
  quantityAffiliateFtd: number;

  @Prop({ default: 0 })
  totalAffiliateFtd: number;

  @Prop({ default: 0 })
  totalAffiliateConversion: number;

  /* @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }] })
  leads: Lead[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }] })
  affiliates: Affiliate[]; */

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'psps' }] })
  pspAvailable: Psp[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }] })
  groupsPspOption: Group[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  department: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  businessUnit: BusinessUnit;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' }] })
  statusAvailable: Status[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'traffics' }] })
  traffics?: Traffic[];
}

export const CrmSchema = SchemaFactory.createForClass(Crm);
