import { PersonCreateDto } from '@person/person/dto/person.create.dto';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  IsDateString,
  IsEmpty,
  IsIP,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserRegisterDto } from '@user/user/dto/user.register.dto';

export class AffiliateCreateDto extends CreateAnyDto {
  @IsOptional()
  checkApiKey?: boolean;
  @ApiProperty({
    description: 'Affiliate Name',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Affiliate DocId',
  })
  @IsOptional()
  docId: string;

  @ApiProperty({
    description: 'Affiliate email',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Affiliate telephone',
  })
  @IsOptional()
  telephone: string;

  @ApiProperty({
    description: 'Affiliate Description',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Affiliate Id in the CRM',
  })
  @IsOptional()
  crmIdAffiliate?: string;

  @ApiProperty({
    description: 'Affiliate Secret Key in the CRM',
  })
  @IsOptional()
  crmApiKeyAffiliate?: string;

  @ApiProperty({
    description: 'Affiliate date to expire the secret key of the CRM',
  })
  @IsDateString()
  @IsOptional()
  crmDateToExpireSecretKeyAffiliate?: Date;

  @IsString()
  @IsOptional()
  tradingPlatformId?: string;

  @IsString()
  @IsOptional()
  buOwnerId?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @ApiProperty({
    description: 'Affiliate username in CRM',
  })
  @IsOptional()
  crmUsernameAffiliate?: string;

  @ApiProperty({
    description: 'Affiliate password in CRM',
  })
  @IsOptional()
  crmPasswordAffiliate?: string;

  @ApiProperty({
    description: 'Affiliate conversion cost',
  })
  @IsNumber()
  @IsOptional()
  conversionCost: number;

  @ApiProperty({
    description: 'Affiliate UserId',
  })
  @IsOptional()
  @IsMongoId()
  userId: ObjectId;
  @ApiProperty({
    description: 'Affiliate User data',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserRegisterDto)
  user?: UserRegisterDto;

  @ApiProperty({
    description: 'Group',
  })
  @IsOptional()
  @IsMongoId()
  group?: ObjectId;

  @ApiProperty({
    description: 'Integration Group',
  })
  @IsNotEmpty()
  @IsString()
  integrationGroup: string;

  @ApiProperty({
    description: 'Affiliate Group',
  })
  @IsOptional()
  @IsString()
  affiliateGroup?: string;

  @ApiProperty({
    description: 'Affiliate Allowed IP',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsIP(4, { each: true })
  ipAllowed?: string[];

  @ApiProperty({
    description: 'Affiliate Personal data',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonCreateDto)
  personalData: PersonCreateDto;

  @ApiProperty({
    description: 'Affiliate Public key',
  })
  @IsEmpty()
  publicKey?: string;

  @ApiProperty({
    description: "Last the affiliate's Brand to lead's traffic send",
  })
  @IsOptional()
  @IsMongoId()
  businessUnit?: ObjectId;

  @IsOptional()
  @IsMongoId()
  crm: ObjectId;

  @IsEmpty()
  creator: ObjectId;
}
