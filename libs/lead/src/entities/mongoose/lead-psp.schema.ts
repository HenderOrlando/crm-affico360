import mongoose, { Document, ObjectId } from 'mongoose';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { LeadPspEntity } from '@lead/lead/entities/lead-psp.entity';
import { Status } from '@status/status/entities/mongoose/status.schema';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { Category } from '@category/category/entities/mongoose/category.schema';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { PspAccount } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Transfer } from '@transfer/transfer/entities/mongoose/transfer.schema';

export type LeadPspDocument = LeadPsp & Document;

@Schema()
export class LeadPsp extends LeadPspEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String], enum: CurrencyCodeAfficoEnum })
  currency: CurrencyCodeAfficoEnum;
  // Amount in minimal units
  @Prop()
  amount: number;

  @Prop()
  leadEmail: string;

  @Prop()
  leadTpId: string;

  @Prop()
  leadCrmName: string;

  @Prop({ type: [String], enum: CountryCodeEnum })
  leadCountry: CountryCodeEnum;

  @Prop()
  idPayment: string;

  @Prop()
  confirmedAt: Date;

  @Prop()
  approved: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'leads' })
  lead: Lead;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  bank: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  department: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  typeTransfer: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psp_accounts' })
  pspAccount: PspAccount;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psps' })
  psp: Psp;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  businessUnit: BusinessUnit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psp_pages' })
  page: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'transfers' })
  transfer: Transfer;
}

export const LeadPspSchema = SchemaFactory.createForClass(LeadPsp);
