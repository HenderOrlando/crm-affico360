import dbIntegrationEnum from '@builder/builders/enums/db-integration.enum';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ScopeDto } from '@permission/permission/dto/scope.dto';
import { Model, ObjectId } from 'mongoose';
import { PermissionCreateDto } from './dto/permission.create.dto';
import { PermissionUpdateDto } from './dto/permission.update.dto';
import { PermissionDocument } from './entities/mongoose/permission.schema';
import { ScopeDocument } from './entities/mongoose/scope.schema';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';

@Injectable()
export class PermissionServiceMongooseService extends BasicServiceModel<
  PermissionDocument,
  Model<PermissionDocument>,
  PermissionCreateDto,
  PermissionUpdateDto
> {
  constructor(
    @Inject('PERMISSION_MODEL_MONGOOSE')
    permissionModel: Model<PermissionDocument>,
    @Inject('SCOPE_MODEL_MONGOOSE')
    private readonly scopeModel: Model<ScopeDocument>,
  ) {
    super(permissionModel);
  }

  async createMany(
    createAnyDto: PermissionCreateDto[],
  ): Promise<PermissionDocument[]> {
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      try {
        for (const dto of createAnyDto) {
          const scope = dto.scopeDto
            ? `${dto.scopeDto.resourceName}:${dto.scopeDto.resourceId}`
            : '*';
          dto.code = `${dto.action}:${dto.resource}:${scope}`;
        }
        return this.model.create(createAnyDto);
      } catch (err) {
        console.error(err);
      }
    }
    return this.model.save(createAnyDto);
  }

  async findScopeByResourceId(resourceId: ObjectId) {
    const scopes = await this.scopeModel
      .find({
        resourceId: resourceId,
      })
      .exec();
    if (scopes.length > 1) {
      throw new BadRequestException('Multiple scope finded');
    }
    return scopes[0];
  }

  async findScopeById(id: ObjectId) {
    return this.scopeModel.findById(id).exec();
  }

  async createScope(scopeDto: ScopeDto) {
    return this.scopeModel.create(scopeDto);
  }

  async findAllScope(
    query: QuerySearchAnyDto,
  ): Promise<ResponsePaginator<ScopeDocument>> {
    let filter: ScopeDocument[];
    if (!query) {
      query = {
        start: 0,
        page: 1,
        take: 10,
      } as QuerySearchAnyDto;
    } else if (!query['start'] || !query['page']) {
      query['take'] = query['take'] ?? 10;
      query['page'] = query['page'] ?? 1;
    }
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      filter = await this.filterScopeApplyMongoose(query);
    } else {
      filter = await this.scopeModel.find(query);
    }
    return this.getScopePaginator(filter, query);
  }

  private async getScopePaginator(
    filter,
    query?: QuerySearchAnyDto,
  ): Promise<ResponsePaginator<ScopeDocument>> {
    const count = await this.count(query);
    const elementsPerPage = query.take ?? 10;
    const currentPage = query.page ?? 1;
    const firstPage = 1;
    const lastPage = Math.ceil(count / elementsPerPage);
    let nextPage = currentPage + 1;
    if (nextPage > lastPage) {
      nextPage = 1;
    }
    let prevPage = currentPage - 1;
    if (prevPage < firstPage) {
      prevPage = lastPage;
    }
    return {
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
      firstPage: firstPage,
      currentPage: currentPage,
      totalElements: count,
      elementsPerPage: elementsPerPage,
      order: query.order,
      list: await filter,
    } as unknown as ResponsePaginator<ScopeDocument>;
  }

  async filterScopeApplyMongoose(query?: QuerySearchAnyDto) {
    if (!!query.start && !!query.page) {
      throw new BadRequestException(
        'Only can use one "start" or "page" no both with "take"',
      );
    }
    if (!!query.searchText) {
      query.where = this.getWhereOrFromSearchtext(query.searchText);
      delete query['searchText'];
    }
    query = this.checkQueryWhere(query);
    const filter = this.scopeModel.find(query.where);
    if (!!query['relations']) {
      for (const attr of query.relations) {
        filter.populate(attr);
      }
    }
    // TODO[hender - 06/12/2023] Check order filter scope
    /* if (!!query.order) {
      filter.sort(query.order);
    } */
    if (!!query.take) {
      filter.limit(query.take);
    }
    if (!!query.start && !query.page) {
      filter.skip(query.start);
    }
    if (!!query.page && !query.start) {
      query.page = query.page - 1 > 0 ? query.page : 1;
      filter.skip(Math.max(0, query.page - 1) * query.take);
    }
    try {
      return await filter.exec();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
