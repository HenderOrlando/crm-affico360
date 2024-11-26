import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { TransferCreateDto } from './transfer.create.dto';

export class TransferUpdateDto extends PartialType(TransferCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
