import { ActivityEntity } from '@activity/activity/entities/activity.entity';
import { Category } from '@category/category/entities/mongoose/category.schema';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/user/entities/mongoose/user.schema';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({
  timestamps: true,
})
export class Activity extends ActivityEntity {
  id: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop({ type: Object })
  object: JSON;

  @Prop({ type: String, enum: ActionsEnum })
  action: ActionsEnum;

  @Prop({ type: String, enum: ResourcesEnum })
  resource: ResourcesEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  creator: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
