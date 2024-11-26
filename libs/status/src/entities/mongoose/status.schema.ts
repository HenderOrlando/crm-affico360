import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEntity } from '@status/status/entities/status.entity';
import { Document, ObjectId } from 'mongoose';

export type StatusDocument = Status & Document;

@Schema({
  timestamps: true,
})
export class Status extends StatusEntity {
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
  active: boolean;

  @Prop({ type: [String], enum: ResourcesEnum })
  resources: ResourcesEnum[];
}

export const StatusSchema = SchemaFactory.createForClass(Status);
