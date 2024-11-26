import { PartialType } from '@nestjs/swagger';
import { PermissionCreateDto } from './permission.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class PermissionUpdateDto extends PartialType(PermissionCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
