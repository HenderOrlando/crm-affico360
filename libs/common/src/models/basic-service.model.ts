import dbIntegrationEnum from '@builder/builders/enums/db-integration.enum';
import { CommonService } from '@common/common';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { isDate, isDateString, isObject, isString } from 'class-validator';
import { ResponsePaginator } from '../interfaces/response-pagination.interface';
import { ServiceModelInterface } from '../interfaces/service-model.interface';
import { ClientSession } from 'mongoose';

export class BasicServiceModel<
  TBasicEntity,
  TBasicModel,
  TBasicCreateDTO = CreateAnyDto,
  TBasicUpdateDTO = UpdateAnyDto,
  TBasicQuerySearch = QuerySearchAnyDto,
> implements
    ServiceModelInterface<
      TBasicEntity,
      TBasicModel,
      TBasicCreateDTO,
      TBasicUpdateDTO,
      TBasicQuerySearch
    >
{
  model: TBasicModel | any;
  nameOrm: number;

  constructor(model: TBasicModel | any) {
    this.model = model;
    this.checkOrmName();
  }

  checkOrmName() {
    if (this.model?.constructor?.name === 'MongoRepository') {
      // TypeORM-Mongo
      this.nameOrm = dbIntegrationEnum.TYPE_ORM_MONGODB;
    } else if (this.model?.base?.constructor.name === 'Mongoose') {
      // Mongoose
      this.nameOrm = dbIntegrationEnum.MONGOOSE;
    } else {
      // TypeORM-Postgres
      this.nameOrm = dbIntegrationEnum.TYPE_ORM_POSTGRES;
    }
  }

  getSearchText(createAnyDto: any) {
    return (
      createAnyDto['name'] +
      CommonService.getSeparatorSearchText() +
      createAnyDto['slug'] +
      CommonService.getSeparatorSearchText()
    );
  }

  async create(
    createAnyDto: TBasicCreateDTO,
    session: ClientSession = null,
  ): Promise<TBasicEntity> {
    if (!!createAnyDto['name'] && !createAnyDto['slug']) {
      createAnyDto['slug'] = CommonService.getSlug(createAnyDto['name']);
    }
    const rta = await this.createMany([createAnyDto], session);
    return rta[0];
  }

  async createMany(
    createAnyDto: TBasicCreateDTO[],
    session: ClientSession = null,
  ): Promise<TBasicEntity[]> {
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      try {
        createAnyDto = createAnyDto.map((dto) => {
          if (!dto['searchText']) {
            dto['searchText'] = this.getSearchText(dto);
          }
          return dto;
        });
        return this.model.create(createAnyDto, { session });
      } catch (err) {
        console.error(err);
      }
    }
    return this.model.save(createAnyDto, { session });
  }

  async findAll(
    query?: TBasicQuerySearch,
    session: ClientSession = null,
  ): Promise<ResponsePaginator<TBasicEntity>> {
    let filter: Promise<TBasicEntity[]>;
    if (!query) {
      query = {
        start: 0,
        page: 1,
        take: 10,
      } as TBasicQuerySearch;
    } else if (!query['start'] || !query['page']) {
      query['take'] = query['take'] ?? 10;
      query['page'] = query['page'] ?? 1;
    }
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      filter = await this.filterApplyMongoose(query, session);
    } else {
      filter = await this.model.findBy(query);
    }
    return this.getPaginator(filter, query);
  }

  private async getPaginator(
    filter,
    query?: TBasicQuerySearch,
  ): Promise<ResponsePaginator<TBasicEntity>> {
    const count = await this.count(query);
    const elementsPerPage = parseInt(query['take'] ?? 10);
    const currentPage = parseInt(query['page'] ?? 1);
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
      order: query['order'],
      list: await filter,
    } as ResponsePaginator<TBasicEntity>;
  }

  async filterApplyMongoose(
    query?: TBasicQuerySearch,
    session: ClientSession = null,
  ) {
    if (!!query['start'] && !!query['page']) {
      throw new BadRequestException(
        'Only can use one "start" or "page" no both with "take"',
      );
    }
    if (!!query['searchText']) {
      query['where'] = this.getWhereOrFromSearchtext(
        query['searchText'],
        query['where'],
      );
      delete query['searchText'];
    }
    query = this.checkQueryWhere(query);
    const filter = this.model.find(query['where']);
    if (!!query['relations']) {
      for (const attr of query['relations']) {
        filter.populate(attr);
      }
    }
    query['order'] = query['order'] ?? [['createdAt', 'desc']];
    filter.sort(query['order']);
    if (!!query['take']) {
      filter.limit(query['take']);
    }
    if (!!query['start'] && !query['page']) {
      filter.skip(query['start']);
    }
    if (!!query['page'] && !query['start']) {
      query['page'] = query['page'] - 1 > 0 ? query['page'] : 1;
      filter.skip(Math.max(0, query['page'] - 1) * query['take']);
    }
    try {
      return await filter.exec({ session });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  protected getWhereOrFromSearchtext(searchText: string, where?: any) {
    where = where || {};
    const expressionOr = searchText.split('|');
    // By type search
    //  value1 value2    value1 && value2
    //  value1 | value2  value1 || value2
    for (const h in expressionOr) {
      if (expressionOr[h].length < 1) {
        continue;
      }
      const expressionAnd = expressionOr[h].split(' ');
      for (const j in expressionAnd) {
        if (expressionAnd[j].length < 1) {
          continue;
        }
        const expression = expressionAnd[j].split(':');
        const operation = {};
        let attr = expression[0];
        let value = expression[1];
        if (!value) {
          value = attr;
          attr = null;
        }
        if (!attr) {
          operation['searchText'] = new RegExp(`.*${value.toString()}.*`);
          /* operation['searchText'] = new RegExp(
            `.*${CommonService.getSlug(value)}.*`,
          ); */
        } else {
          if (value.startsWith('~')) {
            // LIKE
            operation[attr] = new RegExp(`.*${value.substring(1)}.*`);
          } else {
            operation[attr] = this.getValueFromSearchText(value);
          }
        }
        if (expressionOr.length > 1) {
          where['$or'] = where['$or'] ?? [];
          where['$or'].push(operation);
        } else {
          where['$and'] = where['$and'] ?? [];
          where['$and'].push(operation);
          /* where[attr] = where[attr] ?? { $in: [] };
          where[attr]['$in'].push(operation[attr]); */
        }
      }
    }
    return where;
  }

  private getValueFromSearchText(val: string) {
    let operation = '$eq';
    let value: string | Date = val;
    if (val.startsWith('>')) {
      operation = '$gt';
      value = val.substring(1);
      if (isDateString(val)) {
        value = new Date(val);
      }
    } else if (val.startsWith('>=')) {
      operation = '$gte';
      value = val.substring(2);
      if (isDateString(val)) {
        value = new Date(val);
      }
    } else if (val.startsWith('<')) {
      operation = '$lt';
      value = val.substring(1);
      if (isDateString(val)) {
        value = new Date(val);
      }
    } else if (val.startsWith('<=')) {
      operation = '$lte';
      value = val.substring(2);
      if (isDateString(val)) {
        value = new Date(val);
      }
    }
    const searchAttr = {};
    searchAttr[operation] = value;
    return searchAttr;
  }

  async findOne(id: string): Promise<TBasicEntity> {
    try {
      let rta;
      if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
        rta = await this.model.findOne({ _id: id });
      } else {
        rta = await this.model.findOne({ id: id });
      }
      if (!rta) rta = null;
      return rta;
    } catch (err) {
      Logger.error(err, BasicServiceModel.name);
      return null;
    }
  }

  async update(
    id: string,
    updateAnyDto: TBasicUpdateDTO,
  ): Promise<TBasicEntity> {
    id = id || updateAnyDto['id'];
    delete updateAnyDto['id'];
    if (!id) {
      throw new BadRequestException('Id is not finded');
    }
    let rta;
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      if (!updateAnyDto['searchText']) {
        updateAnyDto['searchText'] = this.getSearchText(updateAnyDto);
      }
      //rta = await this.model.findOneAndUpdate({ _id: id }, updateAnyDto);
      rta = await this.model.updateOne({ _id: id }, updateAnyDto);
    } else {
      rta = await this.model.update(id, updateAnyDto);
    }
    if (rta.hasOwnProperty('affected') || rta.matchedCount) {
      return this.findOne(id);
    }
    return rta;
  }

  async updateMany(
    ids: string[],
    updateAnysDto: TBasicUpdateDTO[],
  ): Promise<TBasicEntity[]> {
    const promises = [];
    for (const anyDto of updateAnysDto) {
      promises.push(this.update(anyDto['id'], anyDto));
      delete anyDto['id'];
    }
    return Promise.all(promises);
  }

  async remove(id: string): Promise<TBasicEntity> {
    const elem = await this.findOne(id);
    let action;
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      action = this.model.deleteOne({ _id: id });
    } else {
      action = this.model.delete(id);
    }
    return action.then(
      (rta) => {
        if (rta.affected == 1 || rta.deletedCount == 1) {
          delete elem['id'];
          delete elem['_id'];
          return elem;
        }
        return rta;
      },
      (err) => Promise.resolve(err),
    );
  }

  async removeMany(ids: string[]): Promise<TBasicEntity[]> {
    const promises = [];
    for (const id of ids) {
      promises.push(this.remove(id));
    }
    return Promise.all(promises);
  }

  async removeAllData(query = {}) {
    try {
      await this.model.deleteMany(query);
      return true;
    } catch (err) {
      Logger.error(err, BasicServiceModel.name);
      throw new BadRequestException(
        `Can't remove all data of query ${JSON.stringify(query)}`,
      );
    }
  }

  async clear() {
    return this.model.deleteMany({});
  }

  async count(query?: TBasicQuerySearch) {
    query = this.checkQueryWhere(query);
    const tmp = this.model.count();
    if (!!query && !!query['where']) {
      tmp.where(query['where']);
    }
    return tmp.exec();
  }

  protected checkQueryWhere(query?: TBasicQuerySearch): TBasicQuerySearch {
    if (!!query && !!query['where']) {
      for (const key in query['where']) {
        if (key === '$or') {
          for (const attr of query['where'][key]) {
            const key = Object.keys(attr)[0];
            // Use date filter
            attr[key] = this.getDateRange(Object.values(attr)[0], key);
            // Use regex
            attr[key] = this.getRegex(Object.values(attr)[0]);
          }
        } else {
          if (!!query['where'][key]) {
            // Use date filter
            query['where'][key] = this.getDateRange(query['where'][key], key);
            // Use regex
            query['where'][key] = this.getRegex(query['where'][key]);
          }
        }
      }
    }
    return query;
  }
  private getRegex(value) {
    let rta = value;
    if (
      !!value &&
      typeof value == 'string' &&
      value.indexOf('/') === 0 &&
      value.split('/').length == 3
    ) {
      // Use regex
      const regex = value.split('/');
      regex[2] = regex[2].length > 0 ? regex[2] : 'ig';
      rta = {
        $regex: new RegExp(CommonService.escapeStringRegex(regex[1]), regex[2]),
      };
    }
    return rta;
  }

  private getDateRange(value, key) {
    let rta = value;
    if (!!value['start'] || !!value['end']) {
      const attrName = this.getAttrName(value);
      rta = this.getTimeRange(value, attrName, key);
    }
    return rta;
  }

  private getAttrName(value) {
    const attrName = {
      start: 'start',
      end: 'end',
    };
    if (!!value['from']) {
      attrName.start = 'from';
      value['start'] = value['from'];
      delete value['from'];
    }
    if (value['to']) {
      attrName.end = 'to';
      value['end'] = value['to'];
      delete value['to'];
    }
    return attrName;
  }
  private getGreater(startValue) {
    let greater;
    if (startValue && (isDateString(startValue) || isDate(startValue))) {
      if (isDateString(startValue)) {
        greater = CommonService.getDateFromOutside(startValue, true);
      } else {
        greater = startValue;
      }
      greater = greater.getTime();
    }
    return greater;
  }
  private getSmaller(endValue) {
    let smaller;
    if (endValue && (isDateString(endValue) || isDate(endValue))) {
      if (isDateString(endValue)) {
        smaller = CommonService.getDateFromOutside(endValue, false);
      } else {
        smaller = endValue;
      }
      smaller = smaller.getTime();
    }
    return smaller;
  }

  private getTimeRange(value, attrName, key) {
    const timeRange = CommonService.checkDateAttr(value);
    return timeRange;
  }

  private checkErrorTimeRange(greater, smaller, value, attrName, key) {
    let error: string = null;
    if (!greater && !!value['start']) {
      error = 'Invalid value ' + attrName.start + ' of "' + key + '"';
    } else if (!smaller && !!value['end']) {
      error = 'Invalid value ' + attrName.end + ' of "' + key + '"';
    } else if (!!greater && !!smaller && greater > smaller) {
      error =
        'Invalid value of "' +
        key +
        '", date "' +
        attrName.end +
        '" must be grater than "' +
        attrName.start +
        '"';
    }
    if (error) {
      throw new BadRequestException(error);
    }
  }
}
