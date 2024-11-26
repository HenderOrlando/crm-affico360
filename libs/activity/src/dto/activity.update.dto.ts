import { PartialType } from '@nestjs/mapped-types';
import { ActivityCreateDto } from './activity.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ActivityUpdateDto extends PartialType(ActivityCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
