import { CreateAnyDto } from '@common/common/models/create-any.dto';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import TelephoneDto from './telephone.dto';
import LocationDto from './location.dto';
import DocIdTypeEnum from '@common/common/enums/DocIdTypeEnum';

export class PersonCreateDto extends CreateAnyDto {
  @ApiProperty({
    description: 'Person number of document id',
  })
  @IsOptional()
  @IsString()
  numDocId: string;

  @ApiProperty({
    description: 'Person number of document id',
  })
  @IsOptional()
  @IsString()
  @IsEnum(DocIdTypeEnum)
  typeDocId: DocIdTypeEnum;

  @ApiProperty({
    description: 'Person name',
  })
  @IsString()
  @ValidateIf((o) => !o.email || typeof o.email !== 'string')
  firstName: string;

  @ApiProperty({
    description: 'Person description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'person lastName',
    default: '',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'Emails arrayList',
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateIf((o) => !o.email || typeof o.email !== 'string')
  @Transform(({ value }) => (Array.isArray(value) ? value : undefined))
  emails: string[];

  @ApiProperty({
    description: 'One email to emails',
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.emails || !Array.isArray(o.emails))
  @Transform(({ value }) => (value ? value.toString() : value))
  email: string;

  @ApiProperty({
    description: 'Person telephones arrayList',
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @IsObject({ each: true })
  @Type(() => TelephoneDto)
  telephones: TelephoneDto[];

  @ApiProperty({
    description: 'PhoneNumber to telephones',
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'Person location',
  })
  @IsObject()
  @IsOptional()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'The country to location',
  })
  @IsString()
  @IsOptional()
  country: string;
  //job :JobModel,
  //birth :BirthModel,
  //gender :GenderEnum,
  //kyc :KyCModel,

  @ApiProperty({
    description: 'User ID',
  })
  @IsOptional()
  @IsMongoId()
  user: ObjectId;

  @ApiProperty({
    description: 'User ID',
  })
  @IsOptional()
  @IsMongoId({ each: true })
  affiliates: ObjectId[];

  @ApiProperty({
    description: 'Lead ID',
  })
  @IsOptional()
  @IsMongoId({ each: true })
  leads: ObjectId[];
}
