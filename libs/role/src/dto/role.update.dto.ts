import { PartialType } from '@nestjs/swagger';
import { RoleCreateDto } from './role.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class RoleUpdateDto extends PartialType(RoleCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
