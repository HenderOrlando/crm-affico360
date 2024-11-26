import { PermissionCreateDto } from '@permission/permission/dto/permission.create.dto';
import { PermissionUpdateDto } from '@permission/permission/dto/permission.update.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { PermissionServiceMongooseService } from '@permission/permission';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BuildersService } from '@builder/builders';
import { ScopeDto } from '@permission/permission/dto/scope.dto';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import EventsNamesActivityEnum from 'apps/activity-service/src/enum/events.names.activity.enum';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';

@Injectable()
export class PermissionServiceService {
  constructor(
    @Inject(BuildersService)
    private builder: BuildersService,
    @Inject(PermissionServiceMongooseService)
    private lib: PermissionServiceMongooseService,
  ) {}

  async count() {
    return this.lib.count();
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query?: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newPermission(permission: PermissionCreateDto) {
    if (permission.scope) {
      const scope = await this.validateScope(permission.scope);
      if (!scope?._id) {
        throw new BadRequestException('Wrong scope');
      }
      permission.scopeDto = permission.scope;
      permission.scope = scope._id;
    }
    return this.lib.create(permission);
  }

  async validateScope(scopeDto: ScopeDto) {
    const scope = await this.lib.findScopeByResourceId(scopeDto.resourceId);
    if (scope?._id) {
      return scope;
    }
    const context = { _id: true };
    // TODO[hender-2023/10/04] Validate if that resourceId Exist in resourceName
    /* let context = null;
    switch (scopeDto.resourceName) {
      case ResourcesEnum.ACTIVITY:
        context = await this.builder.getPromiseActivityEventClient(
          EventsNamesActivityEnum.findOneById,
          scopeDto.resourceId,
        );
        break;
      case ResourcesEnum.AFFILIATE:
        context = await this.builder.getPromiseAffiliateEventClient(
          EventsNamesAffiliateEnum.findOneAffiliateById,
          scopeDto.resourceId,
        );
        break;
      case ResourcesEnum.BUSINESS_UNIT:
        context = await this.builder.getPromiseBusinessUnitEventClient(
          EventsNamesBusinessUnitEnum.findOneBusinessUnitById,
          scopeDto.resourceId,
        );
        break;
      case ResourcesEnum.CATEGORY:
        break;
      case ResourcesEnum.CFTD:
        break;
      case ResourcesEnum.CRM:
        break;
      case ResourcesEnum.FILE:
        break;
      case ResourcesEnum.FTD:
        break;
      case ResourcesEnum.GROUP:
        break;
      case ResourcesEnum.IP_ADDRESS:
        break;
      case ResourcesEnum.LEAD:
        break;
      case ResourcesEnum.MESSAGE:
        break;
      case ResourcesEnum.MONETARY_TRANSACTION:
        break;
      case ResourcesEnum.PERMISSION:
        break;
      case ResourcesEnum.PERSON:
        break;
      case ResourcesEnum.PSP:
        break;
      case ResourcesEnum.ROLE:
        break;
      case ResourcesEnum.STATS_AFFILIATE:
        break;
      case ResourcesEnum.STATS_TRANSFER:
        break;
      case ResourcesEnum.STATUS:
        break;
      case ResourcesEnum.USER:
        break;
    } */
    if (!context?._id) {
      throw new BadRequestException('No found scope');
    }
    return this.lib.createScope(scopeDto);
  }

  async newManyPermission(createPermissionsDto: PermissionCreateDto[]) {
    for (const permission of createPermissionsDto) {
      if (permission.scope) {
        const scope = await this.validateScope(permission.scope);
        if (!scope?._id) {
          throw new BadRequestException('Wrong scope');
        }
        permission.scope = scope._id;
      }
    }
    return this.lib.createMany(createPermissionsDto);
  }

  async updatePermission(permission: PermissionUpdateDto) {
    return this.lib.update(permission.id.toString(), permission);
  }

  async updateManyPermissions(permissions: PermissionUpdateDto[]) {
    return this.lib.updateMany(
      permissions.map((permission) => permission.id.toString()),
      permissions,
    );
  }

  async deletePermission(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyPermissions(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async findAllScope(query?: QuerySearchAnyDto) {
    return this.lib.findAllScope(query);
  }
}
