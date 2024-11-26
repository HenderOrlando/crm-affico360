import { Activity } from '@activity/activity/entities/mongoose/activity.schema';
import { CategoryEntity } from '@category/category/entities/category.entity';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { File } from '@file/file/entities/mongoose/file.schema';
import { Group } from '@group/group/entities/mongoose/group.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Role } from '@role/role/entities/mongoose/role.schema';
import mongoose, { Document, ObjectId } from 'mongoose';
import { CategoryInterface } from '../category.interface';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
})
export class Category extends CategoryEntity implements CategoryInterface {
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
  valueNumber: number;

  @Prop()
  valueText: string;

  @Prop({ type: String, enum: TagEnum })
  type: TagEnum;

  @Prop({ type: [String], enum: ResourcesEnum })
  resources: ResourcesEnum[];

  /* @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }] })
  roles: Role[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'files' }] })
  files: File[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }] })
  groups: Group[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'crms' }] })
  crms: Crm[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'psps' }] })
  psps: Psp[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' }] })
  activities: Activity[]; */

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
