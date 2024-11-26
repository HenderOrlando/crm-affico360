import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class MoveLeadDto extends CreateAnyDto {
  @IsMongoId()
  lead: string;
  @IsMongoId()
  brand: string;
}
