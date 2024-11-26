import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import LocationModel from '@common/common/models/LocationModel';
import { ObjectId } from 'mongodb';
import { Type } from 'class-transformer';
import BasicDto from './basic.dto';
import GeopointDto from './geopoint.dto';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';

export default class LocationDto implements LocationModel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsMongoId()
  @IsOptional()
  category!: ObjectId;

  @IsObject()
  @IsOptional()
  @Type(() => BasicDto)
  colony!: BasicDto;

  @IsObject()
  @IsOptional()
  @Type(() => BasicDto)
  city!: BasicDto;

  @IsOptional()
  @IsEnum(CountryCodeAfficoEnum)
  country: CountryCodeAfficoEnum;

  @IsOptional()
  @IsMongoId()
  countryId!: ObjectId;

  @IsObject()
  @IsOptional()
  @Type(() => BasicDto)
  address!: BasicDto;

  @IsObject()
  @IsOptional()
  @Type(() => BasicDto)
  street!: BasicDto;

  @IsObject()
  @IsOptional()
  @Type(() => BasicDto)
  zipcode!: BasicDto;

  @IsObject()
  @IsOptional()
  @Type(() => GeopointDto)
  geopoint!: GeopointDto;
}
