import { ActivityInterface } from '@activity/activity/entities/activity.interface';
import { CategoryEntity } from '@category/category/entities/category.entity';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';

export class ActivityEntity implements ActivityInterface {
  createdAt: Date;
  updatedAt: Date;
  id: ObjectId;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  object: JSON;
  action: ActionsEnum;
  resource: ResourcesEnum;
  creator: UserEntity;
  category: CategoryEntity;
}
