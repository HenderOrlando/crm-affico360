import { PartialType } from '@nestjs/swagger';
import { CrmCreateDto } from './crm.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CrmUpdateDto extends PartialType(CrmCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
