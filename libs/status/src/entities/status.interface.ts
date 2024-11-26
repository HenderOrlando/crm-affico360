import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ObjectId } from 'mongoose';

export interface StatusInterface {
  id: ObjectId;
  _id: string;
  name: string;
  idCashier: string;
  slug: string;
  description: string;
  searchText: string;
  active: boolean;
  resources: ResourcesEnum[];
  createdAt: Date;
  updatedAt: Date;
}

export const StatusPropertiesRelations = [];

export const StatusPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'active',
  'createdAt',
  'updatedAt',
];
