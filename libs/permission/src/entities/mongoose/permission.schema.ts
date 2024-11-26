import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Scope } from '@permission/permission/entities/mongoose/scope.schema';
import { PermissionEntity } from '@permission/permission/entities/permission.entity';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { ConfigPermissionEntity } from '../config.permission.entity';

export type PermissionDocument = Permission & Document;

@Schema({
  timestamps: true,
})
export class Permission extends PermissionEntity {
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
  code: string;

  @Prop({ type: String, enum: ActionsEnum })
  action: ActionsEnum;

  @Prop({ type: String, enum: ResourcesEnum })
  resource: ResourcesEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'scopes' })
  scope: Scope;

  @Prop({ type: ConfigPermissionEntity })
  config: ConfigPermissionEntity;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
