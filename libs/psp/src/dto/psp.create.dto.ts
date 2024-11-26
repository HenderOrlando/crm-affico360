import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ObjectId } from 'mongodb';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PspCreateDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsOptional()
  @IsMongoId()
  status?: ObjectId;

  @IsOptional()
  @IsString()
  idCashier?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  groups?: ObjectId[];
}
