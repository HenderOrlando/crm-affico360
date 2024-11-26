import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ConfigPermissionDto extends CreateAnyDto {
  @IsString()
  @IsOptional()
  @IsArray({ each: true })
  tableHidden: Array<string>;

  @IsString()
  @IsOptional()
  @IsArray({ each: true })
  cardHidden: Array<string>;
}
