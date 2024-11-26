import { CategoryInterface } from '@category/category/entities/category.interface';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { UserInterface } from '@user/user/entities/user.interface';

export interface ActivityInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  object: JSON;
  action: ActionsEnum;
  resource: ResourcesEnum;
  creator: UserInterface;
  category: CategoryInterface;
  createdAt: Date;
  updatedAt: Date;
}

export const ActivityPropertiesRelations = ['creator', 'category'];

export const ActivityPropertiesBasic = [
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'object',
  'action',
  'resource',
  'createdAt',
  'updatedAt',
];
