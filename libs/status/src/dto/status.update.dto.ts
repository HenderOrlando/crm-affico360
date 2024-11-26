import { StatusCreateDto } from './status.create.dto';
import { PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class StatusUpdateDto extends PartialType(StatusCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
