import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { CommonService } from '@common/common';

export class LeadResponseDto {
  constructor(lead: LeadDocument, isAdminAffiliate = false) {
    this.createdAt = lead.createdAt;
    this.id = lead._id;
    this.name = lead.name;
    this.businessUnit = (lead.brand?._id ?? lead.brand).toString();
    this.businessUnitCode = lead.brand.idCashier;
    this.tpId = lead.crmIdLead;
    this.password = lead.password;
    this.accountPassword = lead.crmAccountPasswordLead;
    this.accountId = lead.crmAccountIdLead;
    this.description = lead.description;
    this.docId = lead.docId;
    this.docIdType = lead.personalData?.typeDocId;
    this.email = lead.email;
    //this.telephone = lead.telephone;
    this.referral = lead.referral;
    this.referralType = lead.referralType?.name;
    //this.group = lead.group;
    // TODO[hender] Performance asign status
    const history: Array<StatusLeadHistory> = [];
    if (lead.statusCrm.length) {
      history.push(
        new StatusLeadHistory(lead.statusCrm[0].name, lead.createdAt),
      );
    } else {
      history.push(new StatusLeadHistory(lead.status.name, lead.createdAt));
    }
    if (lead.dateFTD && lead.showToAffiliate) {
      history.push(new StatusLeadHistory('Ftd', lead.dateFTD));
    }
    this.status = history;
    this.country = lead.country;

    // Trackbox
    this.ad = lead.ad;
    this.ai = lead.ai;
    this.ci = lead.ci;
    this.gi = lead.gi;
    this.userIp = lead.userIp;
    this.firstname = lead.firstname;
    this.lastname = lead.lastname;
    this.password = lead.password;
    this.so = lead.so;
    this.sub = lead.sub;
    this.MPC_1 = lead.MPC_1;
    this.MPC_2 = lead.MPC_2;
    this.MPC_3 = lead.MPC_3;
    this.MPC_4 = lead.MPC_4;
    this.MPC_5 = lead.MPC_5;
    this.MPC_6 = lead.MPC_6;
    this.MPC_7 = lead.MPC_7;
    this.MPC_8 = lead.MPC_8;
    this.MPC_9 = lead.MPC_9;
    this.MPC_10 = lead.MPC_10;
    this.MPC_11 = lead.MPC_11;
    this.MPC_12 = lead.MPC_12;
    this.ad = lead.ad;
    this.keywords = lead.keywords;
    this.campaign = lead.campaign;
    this.medium = lead.medium;
    this.campaignId = lead.campaignId;
    this.comments = lead.comments;
    this.sourceId = lead.sourceId;
    if (isAdminAffiliate) {
      this.phone = lead.telephone ?? lead.phone;
    }
  }
  @ApiProperty({
    type: Date,
    description: 'Created date',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    description: 'Created date',
  })
  id: ObjectId;

  @ApiProperty({
    type: String,
    description: 'Name of the lead',
  })
  name: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'TpId of the lead in CRM',
  })
  tpId: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Business Unit of the lead in CRM',
  })
  businessUnit: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Business Unit code of the lead in CRM',
  })
  businessUnitCode: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'AccountId of the lead in CRM',
  })
  accountId: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Account password of the lead in CRM',
  })
  accountPassword: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'DNI of the lead',
  })
  docId: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'DNI type of the lead',
  })
  docIdType: string;

  @ApiProperty({
    type: String,
    description: 'Email of the lead',
  })
  email: string;

  /* @ApiProperty({
    required: false,
    type: String,
    description: 'Telephone number of the lead',
  })
  telephone: string; */

  @ApiProperty({
    required: false,
    type: String,
    description: 'Description of the lead',
  })
  description: string;

  @ApiProperty({
    type: String,
    description: 'Url source of the lead is coming',
  })
  referral: string;

  @ApiProperty({
    type: String,
    description: 'Type of source of the lead',
  })
  referralType: string;

  /* @ApiProperty({
    type: GroupEntity,
    description: 'Group of the lead',
  })
  group: GroupEntity; */

  @ApiProperty({
    required: false,
    type: Array<string>,
    description: 'Statuses of the lead in the CRM',
    examples: ['G - New', 'contacted', 'FTD', 'Moved'],
  })
  status: StatusLeadHistory[];

  @ApiProperty({
    required: false,
    description: 'Country of the lead',
    enum: CountryCodeEnum,
    enumName: 'CountryList',
  })
  country: CountryCodeEnum;

  // Trackbox
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param ai',
  })
  ai?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param ci',
  })
  ci?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param gi',
  })
  gi?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param userIp',
  })
  userIp?: string;
  @ApiProperty({
    type: String,
    description: 'Param firstname',
  })
  firstname?: string;
  @ApiProperty({
    type: String,
    description: 'Param lastname',
  })
  lastname?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param password',
  })
  password?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param phone',
  })
  phone?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param so',
  })
  so?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param sub',
  })
  sub?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_1',
  })
  MPC_1?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_2',
  })
  MPC_2?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_3',
  })
  MPC_3?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_4',
  })
  MPC_4?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_5',
  })
  MPC_5?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_6',
  })
  MPC_6?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_7',
  })
  MPC_7?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_8',
  })
  MPC_8?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_9',
  })
  MPC_9?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_10',
  })
  MPC_10?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_11',
  })
  MPC_11?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param MPC_12',
  })
  MPC_12?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param ad',
  })
  ad?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param keywords',
  })
  keywords?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param campaign',
  })
  campaign?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param campaignId',
  })
  campaignId?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param medium',
  })
  medium?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param sourceId',
  })
  sourceId?: string;
  @ApiProperty({
    required: false,
    type: String,
    description: 'Param comments',
  })
  comments?: string;

  private getDateStatus(nameStatus: string, lead: LeadDocument) {
    const status = {
      active: 'createdAt',
      contacted: 'dateContacted',
      cftd: 'dateCFTD',
      ftd: 'dateFTD',
    };
    return lead[status[nameStatus.toLowerCase()]];
  }
}

class StatusLeadHistory {
  constructor(statusName, date) {
    this.name = statusName;
    this.date = date;
  }
  name: string;
  date: Date;
}
