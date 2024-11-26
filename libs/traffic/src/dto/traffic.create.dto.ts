import { CreateAnyDto } from '@common/common/models/create-any.dto';
import {
  IsDate,
  IsOptional,
  IsString,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class TrafficCreateDto extends CreateAnyDto {
  @IsString()
  name: string;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;

  @IsMongoId()
  @IsOptional()
  nextTraffic: string;

  @IsMongoId()
  @IsOptional()
  prevTraffic: string;

  @IsMongoId()
  @IsNotEmpty()
  person: string;

  @IsMongoId()
  @IsNotEmpty()
  affiliate: string;

  @IsMongoId()
  @IsNotEmpty()
  crm: string;

  @IsMongoId()
  @IsNotEmpty()
  businessUnit: string;
}
