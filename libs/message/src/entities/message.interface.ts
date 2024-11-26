import { CategoryEntity } from '@category/category/entities/category.entity';
import TransportEnum from '@common/common/enums/TransportEnum';
import { ScopeEntity } from '@permission/permission/entities/scope.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { UserEntity } from '@user/user/entities/user.entity';

export interface MessageInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  body: string;
  category: CategoryEntity;
  origin: ScopeEntity;
  destiny: ScopeEntity;
  status: StatusEntity;
  creator: UserEntity;
  transport: TransportEnum;
  createdAt: Date;
  updatedAt: Date;
}

export const MessagePropertiesRelations = [
  'category',
  'origin',
  'destiny',
  'status',
  'creator',
];

export const MessagePropertiesBasic = [
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'body',
  'transport',
  'createdAt',
  'updatedAt',
];
