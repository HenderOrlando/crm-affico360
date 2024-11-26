import { LeadInterface } from '@lead/lead/entities/lead.interface';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class AssignLeadLeverateRequestDto {
  constructor(leadDto: LeadInterface) {
    //this.accountId = leadDto.crmTradingPlatformAccountId;
    this.accountId = leadDto.crmAccountIdLead;
    this.leadStatus = {
      name: 'G - New',
      value: '1',
    };
  }
  @IsString()
  @IsOptional()
  accountId: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsObject()
  @IsOptional()
  leadStatus = {};
}
