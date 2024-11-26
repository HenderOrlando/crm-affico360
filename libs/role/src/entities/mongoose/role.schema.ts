import { Category } from '@category/category/entities/mongoose/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '@permission/permission/entities/mongoose/permission.schema';
import { RoleEntity } from '@role/role/entities/role.entity';
import { Status } from '@status/status/entities/mongoose/status.schema';
import { User } from '@user/user/entities/mongoose/user.schema';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({
  timestamps: true,
})
export class Role extends RoleEntity {
  id: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop({ type: [String] })
  codes: Array<string>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'statuses' })
  status: Status;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }],
  })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
