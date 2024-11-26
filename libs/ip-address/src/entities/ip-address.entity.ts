import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { IpAddressInterface } from '@ip-address/ip-address/entities/ip-address.interface';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';

export class IpAddressEntity implements IpAddressInterface {
  _id?: ObjectId;
  id: ObjectId;
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
