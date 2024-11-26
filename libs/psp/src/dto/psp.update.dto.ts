import { PartialType } from '@nestjs/mapped-types';
import { PspCreateDto } from './psp.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class PspUpdateDto extends PartialType(PspCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
