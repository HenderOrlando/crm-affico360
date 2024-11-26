import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import TelephoneModel from '@common/common/models/TelephoneModel';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { ObjectId } from 'mongodb';

export default class TelephoneDto implements TelephoneModel {
  @IsString()
  @IsNotEmpty()
  @IsEnum(CountryCodeEnum)
  countryName: CountryCodeEnum;

  @IsString()
  @IsOptional()
  phoneName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsMongoId()
  @IsOptional()
  category: ObjectId;
}
