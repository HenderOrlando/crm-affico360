import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ScopeEntity } from '@permission/permission/entities/scope.entity';
import { ObjectId } from 'mongodb';
import { ConfigPermissionEntity } from './config.permission.entity';
import { PermissionInterface } from './permission.interface';

export class PermissionEntity implements PermissionInterface {
  id: ObjectId;
  name: string;
  slug: string;
  action: ActionsEnum;
  resource: ResourcesEnum;
  description: string;
  searchText: string;
  config: ConfigPermissionEntity;

  // TODO[hender] Check the hash method implemented
  code: string;
  scope: ScopeEntity;
  /* roles: RoleEntity[]; */
  createdAt: Date;
  updatedAt: Date;
}
