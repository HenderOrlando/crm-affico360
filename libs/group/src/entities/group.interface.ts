import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { ObjectId } from 'mongoose';
import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';

export interface GroupInterface {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  valueGroup: string;
  description: string;
  searchText: string;
  category: CategoryEntity;
  /* pspGroup: PspEntity[];
  status: StatusEntity;
  crmOptions: CrmEntity[];
  leads: LeadEntity[];
  affiliates: AffiliateEntity[]; */
  createdAt: Date;
  updatedAt: Date;
}

export const GroupPropertiesRelations = [
  'pspGroup',
  'status',
  'crmOptions',
  'leads',
  'category',
  'affiliates',
];

export const GroupPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'createdAt',
  'updatedAt',
];
