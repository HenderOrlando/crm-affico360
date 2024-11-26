import { ActivityEntity } from '@activity/activity/entities/activity.entity';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import TagEnum from '@common/common/enums/TagEnum';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { FileEntity } from '@file/file/entities/file.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { RoleEntity } from '@role/role/entities/role.entity';
import { ObjectId } from 'mongoose';

export interface CategoryInterface {
  _id?: ObjectId;
  id?: ObjectId;
  name: string;
  slug: string;
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

export const CategoryPropertiesRelations = [
  'psps',
  'files',
  'groups',
  'crms',
  'activities',
  'roles',
];

export const CategoryPropertiesBasic = [
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'type',
  'resources',
  'createdAt',
  'updatedAt',
  'valueNumber',
  'valueText',
];
