import { CategoryEntity } from '@category/category/entities/category.entity';
import { UserEntity } from '@user/user/entities/user.entity';

export interface FileInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  uri: string;
  path: string;
  mimetype: string;
  category: CategoryEntity;
  user: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}

export const FilePropertiesRelations = ['category', 'user'];

export const FilePropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'uri',
  'path',
  'mimetype',
  'createdAt',
  'updatedAt',
];
