import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { LeadPspEntity } from '@lead/lead/entities/lead-psp.entity';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { StatusEntity } from '@status/status/entities/status.entity';
import { ObjectId } from 'mongodb';

export class PspEntity implements PspInterface {
  _id?: ObjectId;
  id: ObjectId;
  name: string;
  slug: string;
  description: string;
  idCashier: string;
  searchText: string;
  quantityWithdrawal: number;
  totalWithdrawal: number;
  quantityPayments: number;
  quantityApprovedPayments: number;
  quantityRejectedPayments: number;
  totalPayments: number;
  totalApprovedPayments: number;
  totalRejectedPayments: number;
  approvedPercent: number;
  rejectedPercent: number;
  minDeposit: number;
  maxDeposit: number;
  hasChecked: boolean;

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

  status: StatusEntity;
  crms: CrmEntity[];
  groups: GroupEntity[];
  leadsUsing: LeadPspEntity[];
  category: CategoryEntity;
  businessUnit: BusinessUnitEntity;
  blackListCountries: CategoryEntity[];
  blackListAffiliates: AffiliateEntity[];
  blackListBrands: BusinessUnitEntity[];
  whiteListCountries: CategoryEntity[];
  whiteListAffiliates: AffiliateEntity[];
  whiteListBrands: BusinessUnitEntity[];
  createdAt: Date;
  updatedAt: Date;
}
