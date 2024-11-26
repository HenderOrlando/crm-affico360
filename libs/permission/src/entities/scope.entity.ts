import { ObjectId } from 'mongodb';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ScopeInterface } from '@permission/permission/entities/scope.interface';

export class ScopeEntity implements ScopeInterface {
  id: ObjectId;
  resourceId: ObjectId;
  resourceName: ResourcesEnum;
  createdAt: Date;
  updatedAt: Date;
}
