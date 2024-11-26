import { CreateLeadAffiliateDto } from '@affiliate/affiliate/domain/dto/create-lead-affiliate.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { RegisterLeadLeverateResponseInterface } from '../interface/register.lead.leverate.request.interface';

export class RegisterLeadLeverateRequestDto
  implements RegisterLeadLeverateResponseInterface
{
  constructor(leadDto: CreateLeadAffiliateDto) {
    if (leadDto.firstname) {
      this.firstName = leadDto.firstname || '';
    }
    this.lastName =
      (leadDto.description ?? leadDto.firstname) + ' ' + leadDto.lastname;
    /* this.lastName =
      (leadDto.description ?? leadDto.firstname + ' ' + leadDto.firstname) ||
      leadDto.country; */
    if (leadDto.lastname) {
      this.lastName = leadDto.lastname || '';
    }
    // TODO[hender] Agregar una currency por defecto al CRM
    //this.isoCurrency = leadDto.currencyIso;
    this.isoCurrency = 'USD';
    this.tradingPlatformId = leadDto.tradingPlatformId;
    this.buOwnerId = leadDto.buOwnerId;
    this.organization = leadDto.organization;
    if (leadDto.email) {
      this.email = leadDto.email;
    }
    this.phone = leadDto.phone ?? leadDto.telephone;
    /* if (leadDto.referral) {
      this.registrationUrl = leadDto.referral;
    }
    if (leadDto.country) {
      this.isoCountry = leadDto.country || '';
    } */
    this.isoCountry = leadDto.country;
    this.campaignId = `${leadDto.campaignId} - ${leadDto.campaign}`;
    this.subAffiliate = leadDto.affiliateId;
    //this.tag = leadDto.sourceId;
    this.tag = leadDto.campaign;
    this.additionalInfo2 = leadDto.referral;
    this.additionalInfo3 = leadDto.affiliateName;
  }
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  affiliateTransactionId: string;

  @IsString()
  @IsOptional()
  isoCountry: string;

  @IsString()
  @IsOptional()
  subAffiliate: string;

  @IsString()
  @IsOptional()
  campaignId: string;

  @IsString()
  @IsOptional()
  tag: string;

  @IsString()
  @IsOptional()
  tag1: string;

  @IsString()
  @IsOptional()
  registrationUrl: string;

  @IsString()
  @IsOptional()
  additionalInfo1: string;

  @IsString()
  @IsOptional()
  additionalInfo2: string;

  @IsString()
  @IsOptional()
  additionalInfo3: string;

  @IsString()
  @IsOptional()
  language: string;

  @IsString()
  @IsOptional()
  ip: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @IsString()
  @IsOptional()
  isoCurrency: string;

  @IsString()
  @IsOptional()
  buOwnerId: string;

  @IsString()
  @IsOptional()
  tradingPlatformId: string;

  @IsString()
  @IsOptional()
  organization: string;
}
