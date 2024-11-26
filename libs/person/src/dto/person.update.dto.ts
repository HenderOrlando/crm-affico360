import { PartialType } from '@nestjs/swagger';
import { PersonCreateDto } from './person.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class PersonUpdateDto extends PartialType(PersonCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
