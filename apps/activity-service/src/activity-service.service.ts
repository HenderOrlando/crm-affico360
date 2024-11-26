import { ActivityServiceMongooseService } from '@activity/activity';
import { ActivityCreateDto } from '@activity/activity/dto/activity.create.dto';
import { ActivityUpdateDto } from '@activity/activity/dto/activity.update.dto';
import { ActivityDocument } from '@activity/activity/entities/mongoose/activity.schema';
import { BuildersService } from '@builder/builders';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { BasicMicroserviceService } from '@common/common/models/basic.microservices.service';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class ActivityServiceService
  implements BasicMicroserviceService<ActivityDocument>
{
  // TODO[hender-2023/10/03] Refactor standar Microservice
  private builder: BuildersService;
  constructor(
    @Inject(BuildersService)
    builder: BuildersService,
    @Inject(ActivityServiceMongooseService)
    private lib: ActivityServiceMongooseService,
  ) {
    this.builder = builder;
  }
  findAll(
    query: QuerySearchAnyDto,
    context?: any,
  ): Promise<ResponsePaginator<ActivityDocument>> {
    return this.getAll(query);
  }
  findOneById(id: string, context?: any): Promise<ActivityDocument> {
    throw new Error('Method not implemented.');
  }
  createOne(createDto: CreateAnyDto, context?: any): Promise<ActivityDocument> {
    throw new Error('Method not implemented.');
  }
  createMany(
    createDto: CreateAnyDto[],
    context?: any,
  ): Promise<ActivityDocument[]> {
    throw new Error('Method not implemented.');
  }
  updateOne(updateDto: UpdateAnyDto, context?: any): Promise<ActivityDocument> {
    throw new Error('Method not implemented.');
  }
  updateMany(
    updateDto: UpdateAnyDto[],
    context?: any,
  ): Promise<ActivityDocument[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyById(
    ids: UpdateAnyDto[],
    context?: any,
  ): Promise<ActivityDocument[]> {
    throw new Error('Method not implemented.');
  }
  deleteOneById(id: string, context?: any): Promise<ActivityDocument> {
    throw new Error('Method not implemented.');
  }
  getRta(rta: any, @Ctx() ctx: any) {
    throw new Error('Method not implemented.');
  }
  findAllEvent(query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  downloadEvent(query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  findOneByIdEvent(id: string, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  createOneEvent(createActivityDto: CreateAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  createManyEvent(createActivitysDto: CreateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  updateOneEvent(updateActivityDto: UpdateAnyDto, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  updateManyEvent(updateActivitysDto: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  deleteManyByIdEvent(ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }
  deleteOneByIdEvent(id: string, @Ctx() ctx: RmqContext) {
    throw new Error('Method not implemented.');
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newActivity(activity: ActivityCreateDto) {
    return this.lib.create(activity);
  }

  async newManyActivity(createActivitysDto: ActivityCreateDto[]) {
    return this.lib.createMany(createActivitysDto);
  }

  async updateActivity(activity: ActivityUpdateDto) {
    return this.lib.update(activity.id.toString(), activity);
  }

  async updateManyActivitys(activitys: ActivityUpdateDto[]) {
    return this.lib.updateMany(
      activitys.map((activity) => activity.id.toString()),
      activitys,
    );
  }

  async deleteActivity(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyActivitys(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download(query: QuerySearchAnyDto) {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
}
