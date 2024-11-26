import { PartialType } from '@nestjs/mapped-types';
import { TrafficCreateDto } from './traffic.create.dto';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';

export class TrafficUpdateDto extends PartialType(TrafficCreateDto) {
  @IsString()
  id: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  blackListSources?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  blackListSourcesType?: string[];

  @IsArray()
  @IsOptional()
  @IsEnum(CountryCodeAfficoEnum, { each: true })
  blackListCountries?: CountryCodeAfficoEnum[];
}
