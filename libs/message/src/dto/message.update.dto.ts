import { PartialType } from '@nestjs/mapped-types';
import { MessageCreateDto } from './message.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class MessageUpdateDto extends PartialType(MessageCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
