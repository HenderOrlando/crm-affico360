import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import { GroupInterface } from '@group/group/entities/group.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { StatusEntity } from '@status/status/entities/status.entity';
import { StatusInterface } from '@status/status/entities/status.interface';
import { ObjectId } from 'mongodb';

export interface CrmInterface {
  _id?: ObjectId;
  id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  url: string;
  token: string;
  expTimeToken: Date;
  buOwnerIdCrm: string;
  tradingPlatformIdCrm: string;
  organizationCrm: string;
  idCrm: string;
  secretCrm: string;
  userCrm: string;
  passwordCrm: string;
  quantityLeads: number;
  totalLeads: number;
  quantityFtd: number;
  totalFtd: number;
  quantityCftd: number;
  totalCftd: number;
  totalConversion: number;
  quantityAffiliateFtd: number;
  totalAffiliateFtd: number;
  totalAffiliateConversion: number;
  clientZone: string;
  pspAvailable: PspInterface[];
  groupsPspOption: GroupInterface[];
  department: CategoryInterface;
  category: CategoryInterface;
  status: StatusInterface;
  statusAvailable: StatusInterface[];
  businessUnit: BusinessUnitInterface;
  createdAt: Date;
  updatedAt: Date;
}

export const CrmPropertiesRelations = [
  'pspAvailable',
  'groupsPspOption',
  'department',
  'category',
  'statusAvailable',
  'businessUnit',
];

export const CrmPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'url',
  'token',
  'expTimeToken',
  'buOwnerIdCrm',
  'tradingPlatformIdCrm',
  'organizationCrm',
  'idCrm',
  'secretCrm',
  'userCrm',
  'passwordCrm',
  'quantityLeads',
  'totalLeads',
  'quantityFtd',
  'totalFtd',
  'quantityCftd',
  'totalCftd',
  'totalConversion',
  'quantityAffiliateFtd',
  'totalAffiliateFtd',
  'totalAffiliateConversion',
  'clientZone',
  'createdAt',
  'updatedAt',
];
