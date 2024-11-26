import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { RoleCreateDto } from '@role/role/dto/role.create.dto';
import { RoleUpdateDto } from '@role/role/dto/role.update.dto';
import { RoleServiceMongooseService } from '@role/role';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleServiceService {
  constructor(
    @Inject(RoleServiceMongooseService)
    private lib: RoleServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newRole(role: RoleCreateDto) {
    return this.lib.create(role);
  }

  async newManyRole(createRolesDto: RoleCreateDto[]) {
    return this.lib.createMany(createRolesDto);
  }

  async updateRole(role: RoleUpdateDto) {
    return this.lib.update(role.id.toString(), role);
  }

  async updateManyRoles(roles: RoleUpdateDto[]) {
    return this.lib.updateMany(
      roles.map((role) => role.id.toString()),
      roles,
    );
  }

  async deleteRole(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyRoles(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
}
