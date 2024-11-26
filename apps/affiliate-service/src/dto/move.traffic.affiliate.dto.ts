import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsString } from 'class-validator';

export class MoveTrafficAffiliateDto extends CreateAnyDto {
  @IsString()
  affiliate: string;
  @IsString()
  brand: string;
}
