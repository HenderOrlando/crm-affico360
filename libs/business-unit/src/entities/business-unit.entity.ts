import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { ObjectId } from 'mongodb';

export class BusinessUnitEntity implements BusinessUnitInterface {
  _id?: ObjectId;
  id: ObjectId;
  @ApiProperty({
    type: String,
    description: 'Name of the Brand',
  })
  name: string;
  idCashier: string;
  @ApiProperty({
    type: String,
    description: 'Description of the Brand',
  })
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
  department: CategoryEntity;
  currentCrm: CrmEntity;
  status: StatusEntity;
  crmList: CrmEntity[];
  pspList: PspEntity[];
  createdAt: Date;
  updatedAt: Date;
}
