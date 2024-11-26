import { StatusServiceMongooseService } from '@status/status/status-service-mongoose.service';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { StatusCreateDto } from '@status/status/dto/status.create.dto';
import { StatusUpdateDto } from '@status/status/dto/status.update.dto';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { CommonService } from '@common/common';
import axios from 'axios';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { isArray } from 'class-validator';

@Injectable()
export class StatusServiceService {
  constructor(
    @Inject(StatusServiceMongooseService)
    private lib: StatusServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    if (isArray(query?.where?.resources)) {
      const searchText = [];
      for (const h of query.where.resources) {
        searchText.push(`resources:${h}`);
      }
      delete query.where.resources;
      query.searchText = searchText.join(' | ');
    }
    return this.lib.findAll(query);
  }

  async newStatus(status: StatusCreateDto) {
    return this.lib.create(status);
  }

  async newManyStatus(createStatussDto: StatusCreateDto[]) {
    return this.lib.createMany(createStatussDto);
  }

  async updateStatus(status: StatusUpdateDto) {
    return this.lib.update(status.id.toString(), status);
  }

  async updateManyStatuss(statuss: StatusUpdateDto[]) {
    return this.lib.updateMany(
      statuss.map((status) => status.id.toString()),
      statuss,
    );
  }

  async deleteStatus(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyStatuss(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async checkCashierStatus() {
    try {
      const url =
        'https://webservicesnt.org:4452/get/all-catStatusTransactions-available';
      const statusResponse = await axios.get(url);
      const statusList = statusResponse.data.payload;
      for (const status of statusList) {
        const slug = CommonService.getSlug(status.name);
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
            name: status.name,
            idCashier: status.id,
            slug: slug,
            description: 'Status for cashier',
            resources: [ResourcesEnum.TRANSFER],
          });
        } else {
          await this.lib.create({
            name: status.name,
            idCashier: status.id,
            slug: slug,
            description: 'Status for cashier',
            resources: [ResourcesEnum.TRANSFER],
          });
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
