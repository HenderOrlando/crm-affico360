import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongoose';

export interface IpAddressInterface {
  _id?: ObjectId;
  id: string;
  ip: string;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  active: boolean;
  user: UserEntity;
  affiliate: AffiliateEntity;
  createdAt: Date;
  updatedAt: Date;
}

export const IpAddressPropertiesRelations = ['user', 'affiliate'];

export const IpAddressPropertiesBasic = [
  '_id',
  'id',
  'ip',
  'name',
  'slug',
  'description',
  'searchText',
  'active',
  'createdAt',
  'updatedAt',
];
