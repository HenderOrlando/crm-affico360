import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PspAccount } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { TransferCrmResponse } from '@transfer/transfer/dto/transfer.crm.response.dto';
import { PspResponse } from '@transfer/transfer/dto/transfer.latamcashier.response.dto';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import { User } from '@user/user/entities/mongoose/user.schema';
import mongoose, { Document, ObjectId } from 'mongoose';

export type TransferDocument = Transfer & Document;

@Schema({
  timestamps: true,
})
export class Transfer extends TransferEntity {
  id: ObjectId;

  @Prop({
    index: { unique: true },
  })
  numericId: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
  // Amount in minimal units
  @Prop()
  amount: number;

  @Prop({ type: String, enum: CountryCodeEnum })
  country: CountryCodeEnum;

  @Prop()
  leadEmail: string;

  @Prop()
  leadTpId: string;

  @Prop()
  leadAccountId: string;

  @Prop()
  leadCrmName: string;

  @Prop()
  leadName: string;

  @Prop()
  leadTradingPlatformId: string;

  @Prop()
  crmTransactionId: string;

  @Prop({ type: JSON })
  crmTransactionResponse: JSON;

  @Prop()
  idPayment: string;

  @Prop()
  statusPayment: string;

  @Prop()
  descriptionStatusPayment: string;

  @Prop()
  urlPayment: string;

  @Prop({ type: PspResponse })
  responsePayment: PspResponse;

  @Prop()
  responseCrm: TransferCrmResponse;

  @Prop()
  confirmedAt: Date;

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  hasApproved: boolean;

  @Prop({ default: true })
  checkedOnCashier: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  hasChecked: boolean;

  @Prop({ type: String, enum: CurrencyCodeAfficoEnum })
  currency: CurrencyCodeAfficoEnum;

  @Prop({ type: String, enum: OperationTransactionType })
  operationType: OperationTransactionType;

  @Prop({ type: String, enum: CountryCodeEnum })
  leadCountry: CountryCodeEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'leads' })
  lead: Lead;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' })
  affiliate: Affiliate;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  bank: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  department: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  typeTransaction: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psp_accounts' })
  pspAccount: PspAccount;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psps' })
  psp: Psp;

  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'psp_pages' })
  @Prop()
  page: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'business_units' })
  businessUnit: BusinessUnit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'crms' })
  crm: Crm;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userCreator: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userApprover: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userRejecter: User;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
