import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Group } from '@group/group/entities/mongoose/group.schema';
import { IpAddress } from '@ip-address/ip-address/entities/mongoose/ip-address.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from '@person/person/entities/mongoose/person.schema';
import { Traffic } from '@traffic/traffic/entities/mongoose/traffic.schema';
import { User } from '@user/user/entities/mongoose/user.schema';
import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type AffiliateDocument = Affiliate & Document;

@Schema({
  timestamps: true,
})
export class Affiliate extends AffiliateEntity {
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
  docId: string;

  @Prop()
  email: string;

  @Prop()
  slugEmail: string;

  @Prop()
  telephone: string;

  // % leads conversion
  @Prop({ default: 0 })
  conversionCost: number;

  @Prop()
  tradingPlatformId: string;

  @Prop()
  organization: string;

  @Prop()
  buOwnerId: string;

  @Prop()
  crmIdAffiliate: string;

  @Prop()
  crmApiKeyAffiliate: string;

  @Prop()
  crmTokenAffiliate: string;

  @Prop()
  crmDateToExpireTokenAffiliate: Date;

  @Prop()
  crmUsernameAffiliate: string;

  @Prop()
  crmPasswordAffiliate: string;

  // # leads
  @Prop({ default: 0 })
  quantityLeads: number;

  // $ leads
  @Prop({ default: 0 })
  totalLeads: number;

  // # ftds
  @Prop({ default: 0 })
  quantityFtd: number;

  // $ ftds
  @Prop({ default: 0 })
  totalFtd: number;

  // # cftds
  @Prop({ default: 0 })
  quantityCftd: number;

  // $ cftds
  @Prop({ default: 0 })
  totalCftd: number;

  // % conversion
  @Prop({ default: 0 })
  totalConversion: number;

  // # ftds to show
  @Prop({ default: 0 })
  quantityAffiliateFtd: number;

  // $ ftds to show
  @Prop({ default: 0 })
  totalAffiliateFtd: number;

  // % conversion to show
  @Prop({ default: 0 })
  totalAffiliateConversion: number;

  @Prop()
  publicKey: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }] })
  leads: Lead[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'groups' })
  group: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'groups' })
  affiliateGroup: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'groups' })
  integrationGroup: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'traffics' })
  currentTraffic: Traffic;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'traffics' }] })
  traffics: Traffic[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'persons' })
  personalData: Person;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ip_addresses' }],
  })
  ipAllowed: IpAddress[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  businessUnit: BusinessUnit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'crms' })
  crm: Crm;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  creator: User;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);
