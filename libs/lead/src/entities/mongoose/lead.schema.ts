import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Group } from '@group/group/entities/mongoose/group.schema';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from '@person/person/entities/mongoose/person.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { Transfer } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { User } from '@user/user/entities/mongoose/user.schema';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({
  timestamps: true,
})
export class Lead extends LeadEntity {
  id: ObjectId;

  @Prop()
  searchText: string;

  @Prop()
  name: string;

  @Prop()
  docId: string;

  @Prop()
  email: string;

  @Prop()
  telephone: string;

  @Prop()
  crmIdLead: string;

  @Prop()
  crmAccountIdLead: string;

  @Prop()
  crmAccountPasswordLead: string;

  @Prop()
  crmTradingPlatformAccountId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  crmDepartment: Category;

  @Prop()
  description: string;

  @Prop()
  referral: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  integration: User;

  @Prop({ default: 0 })
  totalPayed: number;

  @Prop({ default: 0 })
  totalTransfer: number;

  @Prop()
  partialFtdAmount: number;

  @Prop()
  partialFtdDate: Date;

  @Prop({ default: 0 })
  quantityTransfer: number;

  @Prop()
  showToAffiliate: boolean;

  @Prop()
  hasSendDisclaimer: boolean;

  @Prop()
  hasAddedCftd: boolean;

  @Prop()
  hasAddedFtd: boolean;

  @Prop()
  hasMoved: boolean;

  @Prop({ type: String, enum: CountryCodeAfficoEnum })
  country: CountryCodeAfficoEnum;

  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  @Prop()
  referralType: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'groups' })
  group: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' }] })
  statusCrm: Status[];

  @Prop()
  dateContacted: Date;

  @Prop()
  dateCFTD: Date;

  @Prop()
  dateFTD: Date;

  @Prop()
  dateRetention: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'persons' })
  personalData: Person;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transfers' }] })
  transfers: Transfer[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'crms' })
  crm: Crm;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  brand: BusinessUnit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' })
  affiliate: Affiliate;

  // Trackbox
  @Prop()
  ai?: string;

  @Prop()
  ci?: string;

  @Prop()
  gi?: string;

  @Prop()
  userIp?: string;

  @Prop()
  firstname?: string;

  @Prop()
  lastname?: string;

  @Prop()
  password?: string;

  @Prop()
  phone?: string;

  @Prop()
  so?: string;

  @Prop()
  sub?: string;

  @Prop()
  MPC_1?: string;

  @Prop()
  MPC_2?: string;

  @Prop()
  MPC_3?: string;

  @Prop()
  MPC_4?: string;

  @Prop()
  MPC_5?: string;

  @Prop()
  MPC_6?: string;

  @Prop()
  MPC_7?: string;

  @Prop()
  MPC_8?: string;

  @Prop()
  MPC_9?: string;

  @Prop()
  MPC_10?: string;

  @Prop()
  MPC_11?: string;

  @Prop()
  MPC_12?: string;

  @Prop()
  ad?: string;

  @Prop()
  keywords?: string;

  @Prop()
  campaign?: string;

  @Prop()
  campaignId?: string;

  @Prop()
  medium?: string;

  @Prop()
  comments?: string;

  @Prop()
  sourceId?: string;

  @Prop()
  responseCrm?: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
