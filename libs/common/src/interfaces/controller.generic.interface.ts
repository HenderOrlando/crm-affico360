import { RmqContext } from '@nestjs/microservices';
import { CreateAnyDto } from '../models/create-any.dto';
import { QuerySearchAnyDto } from '../models/query_search-any.dto';
import { UpdateAnyDto } from '../models/update-any.dto';

export default interface GenericServiceController {
  findAll(query: QuerySearchAnyDto, req?: any);

  findAllEvent(query: QuerySearchAnyDto, ctx: RmqContext);

  //download(query: QuerySearchAnyDto);

  //downloadEvent(query: QuerySearchAnyDto, ctx: RmqContext);

  findOneById(id: string);

  findOneByIdEvent(id: string, ctx: RmqContext);

  createOne(createDto: CreateAnyDto, req?);

  createOneEvent(createDto: CreateAnyDto, ctx: RmqContext);

  createMany(createsDto: CreateAnyDto[], req?);

  createManyEvent(createsDto: CreateAnyDto[], ctx: RmqContext);

  updateOne(updateDto: UpdateAnyDto, req?);

  updateOneEvent(updateDto: UpdateAnyDto, ctx: RmqContext);

  updateMany(updatesDto: UpdateAnyDto[], req?);

  updateManyEvent(updatesDto: UpdateAnyDto[], ctx: RmqContext);

  deleteManyById(ids: UpdateAnyDto[], req?);

  deleteManyByIdEvent(ids: UpdateAnyDto[], ctx: RmqContext);

  deleteOneById(id: string, req?);

  deleteOneByIdEvent(id: string, ctx: RmqContext);
}
