import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class FileCreateDto extends CreateAnyDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  @IsOptional()
  path: string;
  @IsString()
  @IsOptional()
  mimetype: string;
  @IsMongoId()
  @IsOptional()
  category: ObjectId;
  @IsMongoId()
  @IsOptional()
  user: string;
}
