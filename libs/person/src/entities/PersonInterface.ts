import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import DocIdTypeEnum from '@common/common/enums/DocIdTypeEnum';
import GenderEnum from '@common/common/enums/GenderEnum';
import BirthModel from '@common/common/models/BirthModel';
import JobModel from '@common/common/models/JobModel';
import KyCModel from '@common/common/models/KyCModel';
import LocationModel from '@common/common/models/LocationModel';
import TelephoneModel from '@common/common/models/TelephoneModel';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { TrafficEntity } from '@traffic/traffic/entities/traffic.entity';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongoose';

export interface PersonInterface {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  lastName: string;
  email: string[];
  telephone: TelephoneModel[];
  numDocId: string;
  typeDocId: DocIdTypeEnum;
  location: LocationModel;
  job: JobModel;
  birth: BirthModel;
  gender: GenderEnum;
  kyc: KyCModel;
  user: UserEntity;
  leads: LeadEntity[];
  traffics: TrafficEntity[];
  affiliates: AffiliateEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export const PersonPropertiesRelations = [
  'user',
  'leads',
  'traffics',
  'affiliates',
];

export const PersonPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'lastName',
  'email',
  'telephone',
  'numDocId',
  'typeDocId',
  'location',
  'job',
  'birth',
  'gender',
  'kyc',
  'createdAt',
  'updatedAt',
];
