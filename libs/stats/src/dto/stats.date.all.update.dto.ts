import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';
import { StatsDateAllCreateDto } from './stats.date.all.create.dto';

export class StatsDateAllUpdateDto extends PartialType(StatsDateAllCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
