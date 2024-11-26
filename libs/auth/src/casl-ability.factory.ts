import {
  AbilityClass,
  ExtractSubjectType,
  MongoAbility,
  MongoQuery,
  PureAbility,
  SubjectRawRule,
  defineAbility,
} from '@casl/ability';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PermissionServiceMongooseService } from '@permission/permission';
import { User } from '@user/user/entities/mongoose/user.schema';

export type AppRules = SubjectRawRule<
  ActionsEnum,
  ExtractSubjectType<ResourcesEnum>,
  MongoQuery
>[];
export type AppAbility = MongoAbility<[ActionsEnum, ResourcesEnum]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject(PermissionServiceMongooseService)
    private readonly permissionService: PermissionServiceMongooseService,
  ) {}
  async createForUser(user: User) {
    return defineAbility(async (can, cannot) => {
      if (user.permissions) {
        user.permissions = (
          await this.permissionService.findAll({
            relations: ['scope'],
            where: {
              _id: user.permissions,
            },
          } as QuerySearchAnyDto)
        ).list;
      }
      for (const permission of user.permissions) {
        const msg = `You are not allowed to ${permission.action} ${permission.resource} information`;
        if (permission.scope) {
          const condition = {};
          condition[permission.scope.resourceName] =
            permission.scope.resourceId;
          can(permission.action, permission.resource, condition).because(msg);
        } else {
          const action =
            permission.action === 'MANAGE' ? 'manage' : permission.action;
          const resource =
            permission.resource === 'ALL' ? 'all' : permission.resource;
          can(action, resource).because(msg);
        }
        //can('manage', 'all').because(msg);
      }
    });
  }
}
