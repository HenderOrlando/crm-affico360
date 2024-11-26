import { StatsCreateDto } from './stats.create.dto';
import { PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class StatsUpdateDto extends PartialType(StatsCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
