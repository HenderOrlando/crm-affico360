import { CategoryInterface } from '@category/category/entities/category.interface';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { StatusInterface } from '@status/status/entities/status.interface';
import { ObjectId } from 'mongoose';

export interface BusinessUnitInterface {
  _id?: ObjectId;
  id: string;
  name: string;
  idCashier: string;
  slug: string;
  description: string;
  searchText: string;
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
  department: CategoryInterface;
  currentCrm: CrmInterface;
  status: StatusInterface;
  crmList: CrmInterface[];
  pspList: PspInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export const BusinessUnitPropertiesRelations = [
  'department',
  'currentCrm',
  'status',
  'crmList',
  'pspList',
];

export const BusinessUnitPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
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
  'createdAt',
  'updatedAt',
];
