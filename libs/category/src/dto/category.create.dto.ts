import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import TagEnum from '@common/common/enums/TagEnum';

export class CategoryCreateDto extends CreateAnyDto {
  @IsString()
  name: string;

  @IsEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsEnum(TagEnum)
  type: string;

  @IsArray()
  @IsOptional()
  @IsEnum(ResourcesEnum, { each: true })
  resources: ResourcesEnum[];

  @IsNumber()
  @IsOptional()
  valueNumber: number;

  @IsString()
  @IsOptional()
  valueText: string;
}
