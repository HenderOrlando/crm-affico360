import { PartialType } from '@nestjs/swagger';
import { LeadPspCreateDto } from './lead-psp.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class LeadPspUpdateDto extends PartialType(LeadPspCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
