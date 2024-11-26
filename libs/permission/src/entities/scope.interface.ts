import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ObjectId } from 'mongodb';

export interface ScopeInterface {
  id: string;
  resourceId: ObjectId;
  resourceName: ResourcesEnum;
  createdAt: Date;
  updatedAt: Date;
}

export const ScopePropertiesRelations = [];

export const ScopePropertiesBasic = [
  'id',
  'resourceId',
  'resourceName',
  'createdAt',
  'updatedAt',
];
