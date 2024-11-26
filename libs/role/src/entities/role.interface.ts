import { CategoryEntity } from '@category/category/entities/category.entity';
import { PermissionEntity } from '@permission/permission/entities/permission.entity';

export interface RoleInterface {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  description: string;
  searchText: string;
  codes: Array<string>;
  category: CategoryEntity;
  permissions: PermissionEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export const RolePropertiesRelations = ['category', 'permissions'];

export const RolePropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'active',
  'codes',
  'createdAt',
  'updatedAt',
];
