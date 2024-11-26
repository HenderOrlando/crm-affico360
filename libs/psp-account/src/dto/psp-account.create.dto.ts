import {
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ObjectId } from 'mongodb';

export class PspAccountCreateDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  idCashier: string;

  @IsMongoId()
  @IsNotEmpty()
  psp: ObjectId;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  publicKey?: string;

  @IsString()
  @IsOptional()
  privateKey?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsUrl()
  @IsOptional()
  urlApi?: string;

  @IsUrl()
  @IsOptional()
  urlSandbox?: string;

  @IsUrl()
  @IsOptional()
  urlDashboard?: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsMongoId()
  @IsOptional()
  category?: ObjectId;

  @IsMongoId()
  @IsOptional()
  status?: ObjectId;

  @IsMongoId()
  @IsOptional()
  bank?: ObjectId;

  @IsEmpty()
  creator?: ObjectId;

  @IsMongoId({ each: true })
  @IsOptional()
  blackListCountries?: ObjectId[];

  @IsMongoId({ each: true })
  @IsOptional()
  blackListBrands?: ObjectId[];

  @IsMongoId({ each: true })
  @IsOptional()
  whiteListCountries?: ObjectId[];

  @IsMongoId({ each: true })
  @IsOptional()
  whiteListBrands?: ObjectId[];
}
