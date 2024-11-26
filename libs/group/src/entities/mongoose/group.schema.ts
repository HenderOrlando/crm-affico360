import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { GroupEntity } from '@group/group/entities/group.entity';
import { Category } from '@category/category/entities/mongoose/category.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';

export type GroupDocument = Group & Document;

@Schema({
  timestamps: true,
})
export class Group extends GroupEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  valueGroup: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;

  /* @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'psps' }] })
  pspGroup: Psp[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'crms' }] })
  crmOptions: Crm[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }] })
  leads: Lead[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }] })
  affiliates: Affiliate[]; */
}

export const GroupSchema = SchemaFactory.createForClass(Group);
