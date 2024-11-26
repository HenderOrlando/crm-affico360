import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { IpAddressEntity } from '@ip-address/ip-address/entities/ip-address.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/user/entities/mongoose/user.schema';
import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type IpAddressDocument = IpAddress & Document;

@Schema({
  timestamps: true,
})
export class IpAddress extends IpAddressEntity {
  id: ObjectId;

  @Prop()
  ip: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop()
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' })
  affiliate: Affiliate;
}

export const IpAddressSchema = SchemaFactory.createForClass(IpAddress);
