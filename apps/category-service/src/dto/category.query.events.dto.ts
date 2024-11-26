import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsOptional, IsString } from 'class-validator';

export class CategoryQueryEventsDto extends CreateAnyDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  valueText?: string;
}
