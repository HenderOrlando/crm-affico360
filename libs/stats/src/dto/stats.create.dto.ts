import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';

export class StatsCreateDto extends CreateAnyDto {
  @ApiProperty({
    example: 'Test-Name-Stats',
    description: 'Stats name',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Amet elit velit consequat consequat labore ullamco.',
    description: 'Stats description',
  })
  @IsString()
  @MinLength(4)
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 0,
    description: 'Total leads of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  totalLeads: number;

  @ApiProperty({
    example: 0,
    description: 'Total FTD of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  totalFtd: number;

  @ApiProperty({
    example: 0,
    description: 'Total CFTD of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  totalCftd: number;

  @ApiProperty({
    example: 0,
    description: 'Convertion of Affiliate (totalFtd / totalLeads)',
  })
  @IsOptional()
  @IsNumber()
  totalConvertion: number;

  @ApiProperty({
    example: 0,
    description: 'FTD Affiliate to see',
  })
  @IsOptional()
  @IsNumber()
  affiliateFtd: number;

  @ApiProperty({
    example: 0,
    description: 'Convertion Affiliate to see (affiliateFtd / totalLeads)',
  })
  @IsOptional()
  @IsNumber()
  affiliateConvertion: number;

  @ApiProperty({
    example: 0,
    description: 'Today Leads of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  realLeads: number;

  @ApiProperty({
    example: 0,
    description: 'Today FTD of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  realFtd: number;

  @ApiProperty({
    example: 0,
    description: 'Today CFTD of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  realCftd: number;

  @ApiProperty({
    example: 0,
    description: 'Today convertion of Affiliate',
  })
  @IsOptional()
  @IsNumber()
  realConvertion: number;

  @ApiProperty({
    example: 0,
    description: 'Leads of Affiliate before today',
  })
  @IsOptional()
  @IsNumber()
  rateLeads: number;

  @ApiProperty({
    example: 0,
    description: 'FTD of Affiliate before today',
  })
  @IsOptional()
  @IsNumber()
  rateFtd: number;

  @ApiProperty({
    example: 0,
    description: 'Convertion of Affiliate before today',
  })
  @IsOptional()
  @IsNumber()
  rateConvertion: number;

  @IsNotEmpty()
  @IsEnum(CountryCodeEnum)
  country: CountryCodeEnum;

  @IsNotEmpty()
  @IsString()
  affiliate: string;

  @IsNotEmpty()
  @IsString()
  brand: string;
}
