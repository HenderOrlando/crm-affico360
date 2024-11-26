import { ResponsePaginator } from './response-pagination.interface';

export interface ServiceModelInterface<
  TEntity,
  TModel,
  TCreateDTO,
  TUpdateDTO,
  TQuerySearch,
> {
  model: TModel;

  create(createAnyDto: TCreateDTO): Promise<TEntity>;

  createMany(createAnyDto: TCreateDTO[]): Promise<TEntity[]>;

  findAll(query?: TQuerySearch): Promise<ResponsePaginator<TEntity>>;

  findOne(id: string): Promise<TEntity>;

  update(id: string, updateAnyDto: TUpdateDTO): Promise<TEntity>;

  updateMany(ids: string[], updateAnysDto: TUpdateDTO[]): Promise<TEntity[]>;

  remove(id: string): Promise<TEntity>;

  removeMany(ids: string[]): Promise<TEntity[]>;
}
