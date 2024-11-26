import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { GroupEntity } from '@group/group/entities/group.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { ObjectId } from 'mongodb';

export class CrmEntity implements CrmInterface {
  _id?: ObjectId;
  id: ObjectId;
  @ApiProperty({
    type: String,
    description: 'Name ofthe CRM',
  })
  name: string;
  slug: string;
  description: string;
  searchText: string;
  clientZone: string;
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
  pspAvailable: PspEntity[];
  groupsPspOption: GroupEntity[];
  department: CategoryEntity;
  category: CategoryEntity;
  status: StatusEntity;
  statusAvailable: StatusEntity[];
  businessUnit: BusinessUnitEntity;
  createdAt: Date;
  updatedAt: Date;
}
