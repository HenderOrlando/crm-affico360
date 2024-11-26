import { UserChangePasswordDto } from '@user/user/dto/user.change-password.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UserRegisterDto } from '@user/user/dto/user.register.dto';
import { UserUpdateDto } from '@user/user/dto/user.update.dto';
import { UserServiceMongooseService } from '@user/user';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ClientProxy } from '@nestjs/microservices';
import { BuildersService } from '@builder/builders';

@Injectable()
export class UserServiceService {
  private eventClient: ClientProxy;
  constructor(
    @Inject(UserServiceMongooseService)
    private lib: UserServiceMongooseService,
    @Inject(BuildersService)
    builder: BuildersService,
  ) {
    this.eventClient = builder.getEventClient();
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newUser(user: UserRegisterDto) {
    return this.lib.create(user);
  }

  async newManyUser(createUsersDto: UserRegisterDto[]) {
    return this.lib.createMany(createUsersDto);
  }

  async updateUser(user: UserUpdateDto) {
    return this.lib.update(user.id.toString(), user);
  }

  async updateManyUsers(users: UserUpdateDto[]) {
    return this.lib.updateMany(
      users.map((user) => user.id.toString()),
      users,
    );
  }

  async deleteUser(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyUsers(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async changePasswordUser(id: ObjectId, dataPassword: UserChangePasswordDto) {
    return this.lib.changePassword(id, dataPassword);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
}
