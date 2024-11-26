import { Category } from '@category/category/entities/mongoose/category.schema';
import TransportEnum from '@common/common/enums/TransportEnum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Scope } from '@permission/permission/entities/mongoose/scope.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { User } from '@user/user/entities/mongoose/user.schema';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { MessageEntity } from '../message.entity';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
})
export class Message extends MessageEntity {
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
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'scopes' })
  origin: Scope;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'scopes' })
  destiny: Scope;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  creator: User;

  @Prop({ type: String, enum: TransportEnum })
  transport: TransportEnum;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
