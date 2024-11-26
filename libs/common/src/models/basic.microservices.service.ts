import GenericServiceController from '../interfaces/controller.generic.interface';
import { ResponsePaginator } from '../interfaces/response-pagination.interface';
import { CreateAnyDto } from './create-any.dto';
import { QuerySearchAnyDto } from './query_search-any.dto';
import { UpdateAnyDto } from './update-any.dto';

export interface BasicMicroserviceService<TDocument = any>
  extends GenericServiceController {
  findAll(
    query: QuerySearchAnyDto,
    context?: any,
  ): Promise<ResponsePaginator<TDocument>>;

  findOneById(id: string, context?: any): Promise<TDocument>;

  createOne(createDto: CreateAnyDto, context?: any): Promise<TDocument>;

  createMany(createDto: CreateAnyDto[], context?: any): Promise<TDocument[]>;

  updateOne(updateDto: UpdateAnyDto, context?: any): Promise<TDocument>;

  updateMany(updateDto: UpdateAnyDto[], context?: any): Promise<TDocument[]>;

  deleteManyById(ids: UpdateAnyDto[], context?: any): Promise<TDocument[]>;

  deleteOneById(id: string, context?: any): Promise<TDocument>;

  download(query: QuerySearchAnyDto, context?: any): Promise<TDocument[]>;

  getRta(rta, ctx);
}
