import { IsOptional, IsString } from 'class-validator';
import { AntelopeRegisterLeadInterface } from '../interface/antelope-register-lead.interface';
import { CreateLeadAffiliateDto } from '@affiliate/affiliate/domain/dto/create-lead-affiliate.dto';

export class AntelopeRegisterLeadDto implements AntelopeRegisterLeadInterface {
  constructor(leadDto: CreateLeadAffiliateDto) {
    this.firstname = leadDto.firstname;
    this.lastname = leadDto.lastname ?? leadDto.description;
    this.email = leadDto.email;
    this.telephone = leadDto.telephone;
    this.sc = leadDto.referral;
    //this.offer = 'affico360';
    this.countryiso = leadDto.countryIso;
  }
  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  telephoneprefix: string;

  @IsString()
  @IsOptional()
  telephone: string;

  @IsString()
  @IsOptional()
  sc: string;

  @IsString()
  @IsOptional()
  ip: string;

  @IsString()
  @IsOptional()
  offer: string;

  @IsString()
  @IsOptional()
  usertype: string;

  @IsString()
  @IsOptional()
  countryiso: string;

  @IsString()
  @IsOptional()
  languageiso: string;

  @IsString()
  @IsOptional()
  p1: string;

  @IsString()
  @IsOptional()
  p2: string;

  @IsString()
  @IsOptional()
  p3: string;

  @IsString()
  @IsOptional()
  p4: string;

  @IsString()
  @IsOptional()
  p5: string;

  @IsString()
  @IsOptional()
  visitid: string;
}
