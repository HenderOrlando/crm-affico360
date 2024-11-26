import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { GroupCreateDto } from '@group/group/dto/group.create.dto';
import { GroupUpdateDto } from '@group/group/dto/group.update.dto';
import { GroupServiceMongooseService } from '@group/group';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GroupServiceService {
  constructor(
    @Inject(GroupServiceMongooseService)
    private lib: GroupServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newGroup(group: GroupCreateDto) {
    return this.lib.create(group);
  }

  async newManyGroup(createGroupsDto: GroupCreateDto[]) {
    return this.lib.createMany(createGroupsDto);
  }

  async updateGroup(group: GroupUpdateDto) {
    return this.lib.update(group.id.toString(), group);
  }

  async updateManyGroups(groups: GroupUpdateDto[]) {
    return this.lib.updateMany(
      groups.map((group) => group.id.toString()),
      groups,
    );
  }

  async deleteGroup(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyGroups(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
}
