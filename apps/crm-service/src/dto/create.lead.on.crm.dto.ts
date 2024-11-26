import { CreateLeadAffiliateDto } from '@affiliate/affiliate/domain/dto/create-lead-affiliate.dto';

export interface CreateLeadOnCrmDto {
  secretKey: string;
  leadDto: CreateLeadAffiliateDto;
}
