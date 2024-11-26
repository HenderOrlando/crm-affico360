import { IsMongoId, IsBoolean, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export class PspHasActiveDto {
  @IsMongoId()
  @IsNotEmpty()
  id: ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  hasActive: boolean;
}
