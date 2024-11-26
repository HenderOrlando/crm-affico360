import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import { FileInterface } from '@file/file/entities/file.interface';
import { PermissionInterface } from '@permission/permission/entities/permission.interface';
import { PersonInterface } from '@person/person/entities/PersonInterface';
import { RoleInterface } from '@role/role/entities/role.interface';
import { ObjectId } from 'mongoose';

export interface UserInterface {
  _id?: ObjectId;
  id: ObjectId;
  email: string;
  slugEmail: string;
  searchText: string;
  name: string;
  slug: string;
  description: string;
  username: string;
  slugUsername: string;
  password: string;
  confirmPassword?: string;
  active: boolean;
  isClientAPI: boolean;
  apiKey: string;
  configuration: JSON;
  twoFactorSecret: string;
  twoFactorQr: string;
  twoFactorIsActive: boolean;
  image: FileInterface;
  role: RoleInterface;
  permissions: Array<PermissionInterface>;
  authorizations: Array<string>;
  category: CategoryInterface;
  personalData: PersonInterface;
  userParent: UserInterface;
  createdAt: Date;
  updatedAt: Date;
}

export const UserPropertiesRelations = [
  'image',
  'role',
  'category',
  'personalData',
  'userParent',
];

export const UserPropertiesBasic = [
  '_id',
  'id',
  'email',
  'slugEmail',
  'searchText',
  'name',
  'slug',
  'description',
  'username',
  'slugUsername',
  'password',
  'confirmPassword',
  'active',
  'isClientAPI',
  'apiKey',
  'configuration',
  'twoFactorSecret',
  'twoFactorQr',
  'createdAt',
  'updatedAt',
];
