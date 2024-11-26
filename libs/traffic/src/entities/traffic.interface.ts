import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { PersonInterface } from '@person/person/entities/PersonInterface';
import { ObjectId } from 'mongoose';
export interface TrafficInterface {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  startDate: Date;
  endDate: Date;
  nextTraffic: TrafficInterface;
  prevTraffic: TrafficInterface;
  person: PersonInterface;
  affiliate: AffiliateInterface;
  crm: CrmInterface;
  businessUnit: BusinessUnitInterface;
  blackListSources: string[];
  blackListSourcesType: CategoryInterface[];
  blackListCountries: CountryCodeAfficoEnum[];
  createdAt: Date;
  updatedAt: Date;
}

export const TrafficPropertiesRelations = [
  'nextTraffic',
  'prevTraffic',
  'person',
  'affiliate',
  'crm',
  'businessUnit',
  'blackListSourcesType',
];

export const TrafficPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'startDate',
  'endDate',
  'blackListSources',
  'blackListSourcesType',
  'blackListCountries',
  'createdAt',
  'updatedAt',
];
