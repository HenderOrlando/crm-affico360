import { UserChangePasswordDto } from './user.change-password.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CommonService } from '@common/common';

export class UserRegisterDto extends UserChangePasswordDto {
  @ApiProperty({
    description: 'Password User',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  @MaxLength(50)
  @Matches(CommonService.patternPassword, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'Start active User',
  })
  @IsBoolean()
  active = true;

  @ApiProperty({
    description: 'Confirm Password User',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  @MaxLength(50)
  @Matches(CommonService.patternPassword, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'Email User',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Name User',
  })
  @IsString()
  name: string;

  @IsMongoId()
  @IsOptional()
  role?: ObjectId;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  permissions?: Array<ObjectId>;

  @IsOptional()
  @IsString({ each: true })
  authorizations?: Array<ObjectId>;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsEmpty()
  twoFactorQr: string;

  @IsEmpty()
  twoFactorSecret: string;

  @IsEmpty()
  twoFactorIsActive: boolean;
}
