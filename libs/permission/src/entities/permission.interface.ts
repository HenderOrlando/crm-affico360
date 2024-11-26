import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ScopeEntity } from '@permission/permission/entities/scope.entity';
import { ConfigPermissionInterface } from './config.permission.interface';

export interface PermissionInterface {
  id: string;
  name: string;
  slug: string;
  action: ActionsEnum;
  resource: ResourcesEnum;
  description: string;
  searchText: string;
  config: ConfigPermissionInterface;

  // TODO[hender] Check the hash method implemented
  code: string;
  scope: ScopeEntity;
  createdAt: Date;
  updatedAt: Date;
}

export const PermissionPropertiesRelations = ['scope'];

export const PermissionPropertiesBasic = [
  'id',
  'name',
  'slug',
  'action',
  'resource',
  'description',
  'searchText',
  'config',
  'createdAt',
  'updatedAt',
];
