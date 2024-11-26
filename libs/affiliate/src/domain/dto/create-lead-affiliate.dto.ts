import { CreateAnyDto } from '@common/common/models/create-any.dto';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import DocIdTypeEnum from '@common/common/enums/DocIdTypeEnum';
import { ApiProperty } from '@nestjs/swagger';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { ObjectId } from 'mongoose';

export class CreateLeadAffiliateDto extends CreateAnyDto {
  @IsEmpty()
  _id?: string;

  @IsEmpty()
  tradingPlatformId?: string;

  @IsEmpty()
  buOwnerId?: string;

  @IsEmpty()
  organization?: string;

  @IsEmpty()
  crmDepartment?: string;

  @IsEmpty()
  affiliateId?: string;

  @IsEmpty()
  affiliateName?: string;

  @IsEmpty()
  crm?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'FullName Lead',
    example: 'Jhon Doe',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Lead description',
    example: 'Test lead',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Source of the lead, the URL where the lead is comming?',
    example: 'https://www.facebook.com/link-campaign-from-the-lead',
  })
  @IsString()
  @IsNotEmpty()
  referral: string;

  @IsEmpty()
  integration?: ObjectId;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Type of source of the lead',
    example: 'FBK',
  })
  @IsString()
  @IsOptional()
  referralType: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Email of the lead',
    example: 'jhondoe@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: false,
    type: String,
    description:
      'Telephone of the lead. If send phone, this params is not required',
    example: '+41159753220',
  })
  @IsString()
  @ValidateIf((o) => !o.phone)
  telephone: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Document Number Identification of the lead',
    example: 'CC65498732100',
  })
  @IsOptional()
  numDocId: string;

  @ApiProperty({
    required: false,
    description: 'Type of the Document Number Identification of the lead',
    example: 'CEDULA_CIUDADANIA',
    enum: DocIdTypeEnum,
    enumName: 'DNITypes',
  })
  @IsString()
  @IsOptional()
  @IsEnum(DocIdTypeEnum)
  typeDocId: DocIdTypeEnum;

  @ApiProperty({
    required: true,
    description: 'CountryIso of the lead is comming',
    example: 'EU',
    enum: CountryCodeAfficoEnum,
    enumName: 'CountriesIso',
  })
  @IsEnum(CountryCodeAfficoEnum)
  @IsNotEmpty()
  countryIso: CountryCodeAfficoEnum;

  @IsEnum(CountryCodeAfficoEnum)
  @IsOptional()
  country?: CountryCodeAfficoEnum;

  @IsEnum(CurrencyCodeAfficoEnum)
  @IsOptional()
  currencyIso?: CurrencyCodeAfficoEnum;

  @ApiProperty({
    required: true,
    type: String,
    description: 'PublicKey from the affiliate',
    example: '$2b$08$ndfjtVxNqnlGHYtkzX/Zz.43JaeI0k1rmhkhn4PWZKgc6xaxl0zZ.',
  })
  @IsString()
  @IsNotEmpty()
  secretKey: string;

  // Trackbox
  @ApiProperty({
    required: false,
    type: String,
    description: 'Ai param',
  })
  @IsString()
  @IsOptional()
  ai?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Ci param',
  })
  @IsString()
  @IsOptional()
  ci?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Gi param',
  })
  @IsString()
  @IsOptional()
  gi?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'UserIp param',
  })
  @IsString()
  @IsOptional()
  userip?: string;
  @ApiProperty({
    required: true,
    type: String,
    description: 'Firstname param',
  })
  @IsString()
  @IsOptional()
  firstname?: string;
  @ApiProperty({
    required: true,
    type: String,
    description: 'Lastname param',
  })
  @IsString()
  @IsOptional()
  lastname?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Password param',
  })
  @IsString()
  @IsOptional()
  password?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Phone param. If send telephone, this param is not required.',
  })
  @IsString()
  @ValidateIf((o) => !o.telephone)
  phone?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'So param',
  })
  @IsString()
  @IsOptional()
  so?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Sub param',
  })
  @IsString()
  @IsOptional()
  sub?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_1 param',
  })
  @IsString()
  @IsOptional()
  MPC_1?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_2 param',
  })
  @IsString()
  @IsOptional()
  MPC_2?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_3 param',
  })
  @IsString()
  @IsOptional()
  MPC_3?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_4 param',
  })
  @IsString()
  @IsOptional()
  MPC_4?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_5 param',
  })
  @IsString()
  @IsOptional()
  MPC_5?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_6 param',
  })
  @IsString()
  @IsOptional()
  MPC_6?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_7 param',
  })
  @IsString()
  @IsOptional()
  MPC_7?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_8 param',
  })
  @IsString()
  @IsOptional()
  MPC_8?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_9 param',
  })
  @IsString()
  @IsOptional()
  MPC_9?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_10 param',
  })
  @IsString()
  @IsOptional()
  MPC_10?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_11 param',
  })
  @IsString()
  @IsOptional()
  MPC_11?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'MPC_12 param',
  })
  @IsString()
  @IsOptional()
  MPC_12?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Ad param',
  })
  @IsString()
  @IsOptional()
  ad?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Term param',
  })
  @IsString()
  @IsOptional()
  keywords?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Campaign param',
  })
  @IsString()
  @IsOptional()
  campaign?: string;
  @ApiProperty({
    type: String,
    description: 'CampaignId param',
  })
  @IsString()
  @IsOptional()
  campaignId?: string;
  @ApiProperty({
    type: String,
    description: 'Medium param',
  })
  @IsString()
  @IsOptional()
  medium?: string;
  @ApiProperty({
    type: String,
    description: 'Comments param',
  })
  @IsString()
  @IsOptional()
  comments?: string;
  @ApiProperty({
    type: String,
    description: 'FunnelName param',
  })
  @IsString()
  @IsOptional()
  sourceId?: string;
  @IsEmpty()
  responseCrm?: string;
}
