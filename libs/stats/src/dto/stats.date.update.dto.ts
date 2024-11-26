import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';
import { StatsDateCreateDto } from './stats.date.create.dto';

export class StatsDateUpdateDto extends PartialType(StatsDateCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
