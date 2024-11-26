import { CreateAnyDto } from '@common/common/models/create-any.dto';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class StatusCreateDto extends CreateAnyDto {
  @ApiProperty({
    example: 'Test-Name-Status',
    description: 'Status name',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;
  idCashier: string;

  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    example: 'Amet elit velit consequat consequat labore ullamco.',
    description: 'Status description',
  })
  @IsString()
  @MinLength(4)
  @IsOptional()
  description: string;

  @ApiProperty({
    example: [],
    description: 'Array list for resources',
  })
  @IsArray()
  @IsOptional()
  @IsEnum(ResourcesEnum, { each: true })
  resources: ResourcesEnum[];
}
