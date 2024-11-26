import { PartialType } from '@nestjs/mapped-types';
import { IpAddressCreateDto } from './ip-address.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class IpAddressUpdateDto extends PartialType(IpAddressCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
