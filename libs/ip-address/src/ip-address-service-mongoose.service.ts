import { IpAddressDocument } from '@ip-address/ip-address/entities/mongoose/ip-address.schema';
import { IpAddressCreateDto } from '@ip-address/ip-address/dto/ip-address.create.dto';
import { IpAddressUpdateDto } from '@ip-address/ip-address/dto/ip-address.update.dto';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class IpAddressServiceMongooseService extends BasicServiceModel<
  IpAddressDocument,
  Model<IpAddressDocument>,
  IpAddressCreateDto,
  IpAddressUpdateDto
> {
  constructor(
    @Inject('IP_ADDRESS_MODEL_MONGOOSE')
    ipAddressModel: Model<IpAddressDocument>,
  ) {
    super(ipAddressModel);
  }
}
