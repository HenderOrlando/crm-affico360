import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BuildersService } from '@builder/builders';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TrafficServiceMongooseService } from '@traffic/traffic';
import { BlockTrafficCountriesDto } from '@traffic/traffic/dto/block.traffic.countries.dto';
import { BlockTrafficSourcesDto } from '@traffic/traffic/dto/block.traffic.sources.dto';
import { BlockTrafficSourcesTypeDto } from '@traffic/traffic/dto/block.traffic.sourcesType.dto';
import { TrafficCreateDto } from '@traffic/traffic/dto/traffic.create.dto';
import { TrafficUpdateDto } from '@traffic/traffic/dto/traffic.update.dto';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TrafficServiceService {
  private eventClient: ClientProxy;
  constructor(
    @Inject(BuildersService)
    builder: BuildersService,
    @Inject(TrafficServiceMongooseService)
    private lib: TrafficServiceMongooseService,
  ) {
    this.eventClient = builder.getEventClient();
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newTraffic(traffic: TrafficCreateDto) {
    return this.lib.create(traffic);
  }

  async newManyTraffic(createTrafficesDto: TrafficCreateDto[]) {
    return this.lib.createMany(createTrafficesDto);
  }

  async updateTraffic(traffic: TrafficUpdateDto) {
    return this.lib.update(traffic.id.toString(), traffic);
  }

  async updateManyTraffics(traffics: TrafficUpdateDto[]) {
    return this.lib.updateMany(
      traffics.map((traffic) => traffic.id.toString()),
      traffics,
    );
  }

  async deleteTraffic(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyTraffics(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async blockTrafficCountries(data: BlockTrafficCountriesDto) {
    const trafficId = await this.getTrafficIdFromAffiliate(data.id);
    return this.blockTraffic({
      id: trafficId,
      blackListCountries: data.countries,
    });
  }

  async blockTrafficSourcesType(data: BlockTrafficSourcesTypeDto) {
    const trafficId = await this.getTrafficIdFromAffiliate(data.id);
    return this.blockTraffic({
      id: trafficId,
      blackListSourcesType: data.sourcesType,
    });
  }

  async blockTrafficSources(data: BlockTrafficSourcesDto) {
    const trafficId = await this.getTrafficIdFromAffiliate(data.id);
    return this.blockTraffic({
      id: trafficId,
      blackListSources: data.sources,
    });
  }

  private async blockTraffic(data: TrafficUpdateDto) {
    if (!!data.id && data.id.length > 0) {
      return this.lib.update(data.id, data);
    }
    throw new NotFoundException(
      "Can't block traffic, not founded the affiliate",
    );
  }

  private async getTrafficIdFromAffiliate(affiliateId: string): Promise<any> {
    const affiliate: AffiliateDocument = await firstValueFrom(
      this.eventClient.send(EventsNamesAffiliateEnum.findOneById, affiliateId),
    );
    if (!affiliate?.currentTraffic) {
      const trafficDto = {
        name: 'Traffic of ' + affiliate.name,
        startDate: new Date(),
        //endDate: new Date(),
        person: affiliate.personalData.toString(),
        affiliate: affiliate._id.toString(),
        businessUnit: affiliate.businessUnit?.toString(),
        crm: affiliate.crm?.toString(),
      } as TrafficCreateDto;
      const currentTraffic = await this.newTraffic(trafficDto);
      affiliate.currentTraffic = currentTraffic._id.toString();
      await firstValueFrom(
        this.eventClient.send(EventsNamesAffiliateEnum.updateOne, {
          id: affiliate._id,
          currentTraffic: affiliate.currentTraffic,
        }),
      );
    }
    return affiliate?.currentTraffic;
  }
}
