import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { ObjectId } from 'mongodb';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { GroupInterface } from '@group/group/entities/group.interface';
import { ApiProperty } from '@nestjs/swagger';
import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';

export class GroupEntity implements GroupInterface {
  _id?: ObjectId;
  id: ObjectId;
  @ApiProperty({
    type: String,
    description: 'Name of the Group',
  })
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
