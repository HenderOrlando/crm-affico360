import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ObjectId } from 'mongodb';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CrmEntity } from '@crm/crm/entities/crm.entity';

export class BusinessUnitCreateDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  slug: string;
  idCashier: string;

  @IsMongoId()
  @IsOptional()
  currentCrm?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsMongoId({ each: true })
  crmList?: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  pspList?: string[];
}
