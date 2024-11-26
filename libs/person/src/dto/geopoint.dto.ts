import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import GeopointModel from '@common/common/models/GeopointModel';

export default class GeopointDto implements GeopointModel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsLatitude()
  @IsNotEmpty()
  latitude: string;

  @IsNotEmpty()
  @IsLongitude()
  longitude: string;
}
