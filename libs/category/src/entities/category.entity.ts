import { ActivityEntity } from '@activity/activity/entities/activity.entity';
import { CategoryInterface } from '@category/category/entities/category.interface';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { FileEntity } from '@file/file/entities/file.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { RoleEntity } from '@role/role/entities/role.entity';
import { ObjectId } from 'mongoose';

export class CategoryEntity implements CategoryInterface {
  _id?: ObjectId;
  id: ObjectId;
  @ApiProperty({
    type: String,
    description: 'Name',
  })
  name: string;
  slug: string;
  @ApiProperty({
    type: String,
    description: 'Description',
  })
  description: string;
  searchText: string;
  type: TagEnum;
  resources: ResourcesEnum[];
  roles: RoleEntity[];
  files: FileEntity[];
  groups: GroupEntity[];
  crms: CrmEntity[];
  psps: PspEntity[];
  activities: ActivityEntity[];
  createdAt: Date;
  updatedAt: Date;
  valueNumber: number;
  valueText: string;
}
