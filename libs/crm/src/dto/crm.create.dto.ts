import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrmCreateDto extends CreateAnyDto {
  @ApiProperty({
    description: 'Crm name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Crm description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Url API of Crm',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsMongoId()
  @IsOptional()
  status: ObjectId;

  @IsMongoId()
  @IsOptional()
  department: ObjectId;

  @IsMongoId()
  @IsOptional()
  businessUnit: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  category: ObjectId;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  pspAvailable: ObjectId[];

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  statusAvailable: ObjectId[];

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  groupsPspOption: ObjectId[];

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  affiliates: ObjectId[];

  @IsString()
  @IsOptional()
  buOwnerIdCrm: string;

  @IsString()
  @IsOptional()
  tradingPlatformIdCrm: string;

  @IsString()
  @IsOptional()
  organizationCrm: string;

  @IsString()
  @IsOptional()
  idCrm: string;

  @IsString()
  @IsOptional()
  secretCrm: string;

  @IsString()
  @IsOptional()
  userCrm: string;

  @IsString()
  @IsOptional()
  passwordCrm: string;
}
