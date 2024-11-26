import { PspAccountCreateDto } from './psp-account.create.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class PspAccountUpdateDto extends PartialType(PspAccountCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
