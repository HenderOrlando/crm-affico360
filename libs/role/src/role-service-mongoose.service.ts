import dbIntegrationEnum from '@builder/builders/enums/db-integration.enum';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PermissionDocument } from '@permission/permission/entities/mongoose/permission.schema';
import { RoleCreateDto } from '@role/role/dto/role.create.dto';
import { RoleUpdateDto } from '@role/role/dto/role.update.dto';
import { RoleDocument } from '@role/role/entities/mongoose/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoleServiceMongooseService extends BasicServiceModel<
  RoleDocument,
  Model<RoleDocument>,
  RoleCreateDto,
  RoleUpdateDto
> {
  constructor(
    @Inject('ROLE_MODEL_MONGOOSE') roleModel: Model<RoleDocument>,
    @Inject('PERMISSION_MODEL_MONGOOSE')
    private readonly permissionModel: Model<PermissionDocument>,
  ) {
    super(roleModel);
  }

  async createMany(createAnyDto: RoleCreateDto[]): Promise<RoleDocument[]> {
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      try {
        for (const role of createAnyDto) {
          const permissions = await this.permissionModel
            .find({
              _id: role.permissions,
            })
            .exec();
          role.codes = [];
          for (const permission of permissions) {
            role.codes.push(permission.code);
          }
        }
        return this.model.create(createAnyDto);
      } catch (err) {
        Logger.error(err);
      }
    }
    return this.model.save(createAnyDto);
  }
}
