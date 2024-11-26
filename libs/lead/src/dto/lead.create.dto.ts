import { CategoryUpdateDto } from '@category/category/dto/category.update.dto';
import { CommonService } from '@common/common';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PersonCreateDto } from '@person/person/dto/person.create.dto';
import { PersonInterface } from '@person/person/entities/PersonInterface';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmpty,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class LeadCreateDto extends CreateAnyDto {
  @ApiProperty({
    description: 'lead name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmpty()
  searchText: string;

  @ApiProperty({
    description: 'Lead DocId',
  })
  @IsOptional()
  docId: string;

  @ApiProperty({
    description: 'Lead email',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Lead telephone',
  })
  @IsOptional()
  telephone: string;

  @ApiProperty({
    description: 'Lead description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'ID Lead in CRM',
  })
  @IsString()
  @IsOptional()
  crmIdLead?: string;

  @ApiProperty({
    description: 'AccountID Lead in CRM',
  })
  @IsString()
  @IsOptional()
  crmAccountIdLead?: string;

  @IsBoolean()
  @IsOptional()
  showToAffiliate = false;

  @IsBoolean()
  @IsOptional()
  hasSendDisclaimer = false;

  @ApiProperty({
    description: 'Account password Lead in CRM',
  })
  @IsString()
  @IsOptional()
  crmAccountPasswordLead?: string;

  @IsEmpty()
  crmDepartment?: ObjectId;

  @ApiProperty({
    description: 'Password Lead',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  @MaxLength(50)
  @Matches(CommonService.patternPassword, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'Lead referral',
  })
  @IsString()
  @IsNotEmpty()
  referral: string;

  //@IsEmpty()
  @IsOptional()
  integration?: ObjectId;

  @ApiProperty({
    description: 'Lead country',
  })
  @IsEnum(CountryCodeAfficoEnum)
  @IsOptional()
  country: CountryCodeAfficoEnum;

  @ApiProperty({
    example: 'GOOGLE',
    description: 'Lead referral type',
  })
  @IsString()
  @IsOptional()
  referralType: string;

  @IsEmpty()
  referralTypeObj?: CategoryUpdateDto;

  @IsEmpty()
  totalPayed?: number;

  @IsOptional()
  @IsMongoId()
  group?: ObjectId;

  @IsOptional()
  @IsMongoId()
  status?: ObjectId;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  statusCrm?: ObjectId[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonCreateDto)
  personalData?: PersonCreateDto;

  @IsEmpty()
  personalDataObj: PersonInterface;

  @IsOptional()
  @IsMongoId()
  user?: ObjectId;

  @IsMongoId({ each: true })
  @IsOptional()
  pspsUsed?: ObjectId[];

  @IsOptional()
  @IsMongoId()
  crm: ObjectId;

  @IsOptional()
  @IsMongoId()
  brand: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  affiliate: ObjectId;

  @IsOptional()
  @IsDate()
  dateContacted?: Date;

  @IsOptional()
  @IsDate()
  dateCFTD?: Date;

  @IsOptional()
  @IsDate()
  dateFTD?: Date;

  @IsOptional()
  @IsDate()
  dateRetention?: Date;

  // Param
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Param ai',
  })
  @IsString()
  @IsOptional()
  ai?: string;
  @ApiProperty({
    type: String,
    description: 'Param ci',
  })
  @IsString()
  @IsOptional()
  ci?: string;
  @ApiProperty({
    type: String,
    description: 'Param gi',
  })
  @IsString()
  @IsOptional()
  gi?: string;
  @ApiProperty({
    type: String,
    description: 'Param userIp',
  })
  @IsString()
  @IsOptional()
  userIp?: string;
  @ApiProperty({
    type: String,
    description: 'Param firstname',
  })
  @IsString()
  @IsOptional()
  firstname?: string;
  @ApiProperty({
    type: String,
    description: 'Param lastname',
  })
  @IsString()
  @IsOptional()
  lastname?: string;
  @ApiProperty({
    type: String,
    description: 'Param phone',
  })
  @IsString()
  @IsOptional()
  phone?: string;
  @ApiProperty({
    type: String,
    description: 'Param so',
  })
  @IsString()
  @IsOptional()
  so?: string;
  @ApiProperty({
    type: String,
    description: 'Param sub',
  })
  @IsString()
  @IsOptional()
  sub?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_1',
  })
  @IsString()
  @IsOptional()
  MPC_1?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_2',
  })
  @IsString()
  @IsOptional()
  MPC_2?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_3',
  })
  @IsString()
  @IsOptional()
  MPC_3?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_4',
  })
  @IsString()
  @IsOptional()
  MPC_4?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_5',
  })
  @IsString()
  @IsOptional()
  MPC_5?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_6',
  })
  @IsString()
  @IsOptional()
  MPC_6?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_7',
  })
  @IsString()
  @IsOptional()
  MPC_7?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_8',
  })
  @IsString()
  @IsOptional()
  MPC_8?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_9',
  })
  @IsString()
  @IsOptional()
  MPC_9?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_10',
  })
  @IsString()
  @IsOptional()
  MPC_10?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_11',
  })
  @IsString()
  @IsOptional()
  MPC_11?: string;
  @ApiProperty({
    type: String,
    description: 'Param MPC_12',
  })
  @IsString()
  @IsOptional()
  MPC_12?: string;
  @ApiProperty({
    type: String,
    description: 'Param ad',
  })
  @IsString()
  @IsOptional()
  ad?: string;
  @ApiProperty({
    type: String,
    description: 'Param term',
  })
  @IsString()
  @IsOptional()
  keywords?: string;
  @ApiProperty({
    type: String,
    description: 'Param campaign',
  })
  @IsString()
  @IsOptional()
  campaign?: string;
  @ApiProperty({
    type: String,
    description: 'Param campaignId',
  })
  @IsString()
  @IsOptional()
  campaignId?: string;
  @ApiProperty({
    type: String,
    description: 'Param medium',
  })
  @IsString()
  @IsOptional()
  medium?: string;
  @ApiProperty({
    type: String,
    description: 'Param comments',
  })
  @IsString()
  @IsOptional()
  comments?: string;
  @ApiProperty({
    type: String,
    description: 'Param funnelName',
  })
  @IsString()
  @IsOptional()
  sourceId?: string;
  @IsEmpty()
  responseCrm?: string;
}
