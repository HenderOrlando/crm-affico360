import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ObjectId } from 'mongodb';
import {
  IsBoolean,
  IsIP,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class IpAddressCreateDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsIP()
  @IsNotEmpty()
  ip: string;

  @IsMongoId()
  @IsNotEmpty()
  user: ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
