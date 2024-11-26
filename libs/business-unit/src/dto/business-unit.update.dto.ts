import { PartialType } from '@nestjs/mapped-types';
import { BusinessUnitCreateDto } from './business-unit.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class BusinessUnitUpdateDto extends PartialType(BusinessUnitCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
