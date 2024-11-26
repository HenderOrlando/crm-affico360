import { CategoryEntity } from '@category/category/entities/category.entity';
import { PermissionEntity } from '@permission/permission/entities/permission.entity';
import { RoleInterface } from '@role/role/entities/role.interface';
import { ObjectId } from 'mongodb';

export class RoleEntity implements RoleInterface {
  id: ObjectId;
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
