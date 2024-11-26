import { CategoryEntity } from '@category/category/entities/category.entity';
import TransportEnum from '@common/common/enums/TransportEnum';
import { MessageInterface } from '@message/message/entities/message.interface';
import { ScopeEntity } from '@permission/permission/entities/scope.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';

export class MessageEntity implements MessageInterface {
  id: ObjectId;
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
