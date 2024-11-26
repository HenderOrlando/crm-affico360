import { PartialType } from '@nestjs/mapped-types';
import { GroupCreateDto } from './group.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class GroupUpdateDto extends PartialType(GroupCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
