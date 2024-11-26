import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsBoolean, IsString } from 'class-validator';

export class CftdToFtdDto extends CreateAnyDto {
  @IsString()
  id: string;
  @IsBoolean()
  showToAffiliate: boolean;
}
