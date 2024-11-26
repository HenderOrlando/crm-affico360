import { PersonUpdateDto } from '@person/person/dto/person.update.dto';
import { UserChangePasswordDto } from './user.change-password.dto';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIP,
  IsJSON,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreateDto extends UserChangePasswordDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  active = false;

  @IsMongoId()
  role: ObjectId;

  @IsMongoId()
  @IsOptional()
  image: ObjectId;

  @IsMongoId({ each: true })
  @IsOptional()
  affiliate: ObjectId[];

  @IsArray()
  @IsOptional()
  @IsIP(4, { each: true })
  ipAddress: string[];

  @IsMongoId()
  @IsOptional()
  personalData: ObjectId;

  @IsJSON()
  @IsOptional()
  configuration: JSON;

  @IsString()
  @IsOptional()
  twoFactorSecret: string;

  @IsString()
  @IsOptional()
  twoFactorQr: string;

  @IsBoolean()
  @IsOptional()
  twoFactorIsActive: boolean;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  permissions: Array<ObjectId>;
  /* 
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  affiliates: ObjectId[]; */
}
