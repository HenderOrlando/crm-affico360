import { IpAddressCreateDto } from '@ip-address/ip-address/dto/ip-address.create.dto';
import { IpAddressUpdateDto } from '@ip-address/ip-address/dto/ip-address.update.dto';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { IpAddressServiceMongooseService } from '@ip-address/ip-address';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class IpAddressServiceService {
  constructor(
    @Inject(IpAddressServiceMongooseService)
    private lib: IpAddressServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newIpAddress(ipAddress: IpAddressCreateDto) {
    return this.lib.create(ipAddress);
  }

  async newManyIpAddress(createIpAddressesDto: IpAddressCreateDto[]) {
    return this.lib.createMany(createIpAddressesDto);
  }

  async updateIpAddress(ipAddress: IpAddressUpdateDto) {
    return this.lib.update(ipAddress.id.toString(), ipAddress);
  }

  async updateManyIpAddresses(ipAddresss: IpAddressUpdateDto[]) {
    return this.lib.updateMany(
      ipAddresss.map((ipAddress) => ipAddress.id.toString()),
      ipAddresss,
    );
  }

  async deleteIpAddress(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyIpAddresses(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
}
