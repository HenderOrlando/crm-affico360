import { BusinessUnitCreateDto } from '@business-unit/business-unit/dto/business-unit.create.dto';
import { BusinessUnitUpdateDto } from '@business-unit/business-unit/dto/business-unit.update.dto';
import { BusinessUnitServiceMongooseService } from '@business-unit/business-unit';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import CheckStatsType from '@stats/stats/enum/check.stats.type';
import { BusinessUnitDocument } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import { BuildersService } from '@builder/builders';
import axios from 'axios';
import { CommonService } from '@common/common';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import { BadRequestError } from 'passport-headerapikey';
import TagEnum from '@common/common/enums/TagEnum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import { Status } from '@status/status/entities/mongoose/status.schema';

@Injectable()
export class BusinessUnitServiceService {
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(BusinessUnitServiceMongooseService)
    private lib: BusinessUnitServiceMongooseService,
  ) {}

  async count(query: QuerySearchAnyDto) {
    return this.lib.count(query);
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    query = query || {};
    query.where = query.where || {};
    if (!query.where.status) {
      const activeStatus =
        await this.builder.getPromiseStatusEventClient<Status>(
          EventsNamesStatusEnum.findOneByName,
          'active',
        );
      if (!activeStatus) {
        throw new BadRequestError('Status active not found');
      }
      query.where.status = activeStatus._id;
    }
    return this.lib.findAll(query);
  }

  async getAllRetention(query: QuerySearchAnyDto) {
    return this.getAllByDepartment(query, 'Retention');
  }

  async getAllSales(query: QuerySearchAnyDto) {
    return this.getAllByDepartment(query, 'Sales');
  }

  async getAllByDepartment(query: QuerySearchAnyDto, departmentName: string) {
    query = query ?? {};
    query.where = query.where ?? {};
    const retentionCat = await this.builder.getPromiseCategoryEventClient(
      EventsNamesCategoryEnum.findOneByNameType,
      {
        name: departmentName,
        type: TagEnum.DEPARTMENT,
      },
    );
    if (!retentionCat) {
      throw new BadRequestError('Department retention not found');
    }
    query.where.department = retentionCat._id;
    return this.getAll(query);
  }

  async newBusinessUnit(businessUnit: BusinessUnitCreateDto) {
    return this.lib.create(businessUnit);
  }

  async newManyBusinessUnit(createBusinessUnitsDto: BusinessUnitCreateDto[]) {
    return this.lib.createMany(createBusinessUnitsDto);
  }

  async updateBusinessUnit(businessUnit: BusinessUnitUpdateDto) {
    return this.lib.update(businessUnit.id.toString(), businessUnit);
  }

  async updateManyBusinessUnits(businessUnits: BusinessUnitUpdateDto[]) {
    return this.lib.updateMany(
      businessUnits.map((businessUnit) => businessUnit.id.toString()),
      businessUnits,
    );
  }

  async deleteBusinessUnit(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyBusinessUnits(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async checkStats(configCheckStats: ConfigCheckStatsDto) {
    switch (configCheckStats.checkType) {
      case CheckStatsType.ALL:
        this.checkStatsLead(configCheckStats);
        this.checkStatsTransfer(configCheckStats);
        break;
      case CheckStatsType.LEAD:
        this.checkStatsLead(configCheckStats);
        break;
      case CheckStatsType.PSP_ACCOUNT:
        this.checkStatsTransfer(configCheckStats);
        break;
    }
  }

  async checkStatsLead(configCheckStats: ConfigCheckStatsDto, page = 1) {
    const brands: ResponsePaginator<BusinessUnitDocument> =
      await this.lib.findAll({
        page,
      });
    for (const brand of brands.list) {
      this.builder.emitLeadEventClient(
        EventsNamesLeadEnum.checkLeadsForBrandStats,
        brand.id,
      );
    }
    if (brands.currentPage !== brands.lastPage) {
      this.checkStatsLead(configCheckStats, brands.nextPage);
    }
  }

  async checkStatsTransfer(configCheckStats: ConfigCheckStatsDto) {
    Logger.log('CHECK STATS BRANDS TRANSFER');
  }

  async checkCashierBrands() {
    try {
      const url =
        'https://webservicesnt.org:4452/get/all-businessesUnit-available';
      const brandResponse = await axios.get(url);
      const brandList = brandResponse.data.payload;
      for (const brand of brandList) {
        const slug = CommonService.getSlug(brand.name);
        const item = (
          await this.lib.findAll({
            where: {
              slug: slug,
            },
          })
        ).list[0];
        if (item?.id) {
          await this.lib.update(item.id, {
            id: item.id,
            name: brand.name,
            idCashier: brand.id,
            slug: slug,
            description: 'Business Unit active in cashier',
          });
        } else {
          await this.lib.create({
            name: brand.name,
            idCashier: brand.id,
            slug: slug,
            description: 'Business Unit active in cashier',
          });
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
