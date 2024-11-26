import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ObjectId } from 'mongodb';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GroupCreateDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  status: ObjectId;

  @IsMongoId()
  @IsOptional()
  category: ObjectId;
}
