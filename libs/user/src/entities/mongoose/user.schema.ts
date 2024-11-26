import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { FileInterface } from '@file/file/entities/file.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '@permission/permission/entities/mongoose/permission.schema';
import { Person } from '@person/person/entities/mongoose/person.schema';
import { Role } from '@role/role/entities/mongoose/role.schema';
import { UserEntity } from '@user/user/entities/user.entity';
import mongoose, { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  optimisticConcurrency: true,
  // TODO[hender - 2024/02/21] Not execute update password
  statics: {
    setPassword: UserEntity.changePassword,
  },
})
export class User extends UserEntity {
  id: ObjectId;
  @Prop()
  email: string;

  @Prop()
  slugEmail: string;

  @Prop()
  searchText: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  username: string;

  @Prop()
  slugUsername: string;

  @Prop()
  password: string;

  @Prop()
  confirmPassword?: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  isClientAPI: boolean;

  @Prop()
  apiKey: string;

  @Prop({ type: Object })
  configuration: JSON;

  @Prop()
  twoFactorSecret: string;

  @Prop()
  twoFactorQr: string;

  @Prop()
  twoFactorIsActive: boolean;

  @Prop({ type: [String] })
  authorizations: Array<string>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'files' })
  image: FileInterface;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'roles' })
  role: Role;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }],
  })
  permissions: Array<Permission>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'persons' })
  personalData: Person;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' })
  userParent: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
