import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { LeadInterface } from '@lead/lead/entities/lead.interface';
import { ApiProperty } from '@nestjs/swagger';
import { PersonEntity } from '@person/person/entities/person.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { TransferEntity } from '@transfer/transfer/entities/transfer.entity';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';

export class LeadEntity implements LeadInterface {
  _id?: ObjectId;
  @ApiProperty({
    type: Date,
    description: 'Created date',
  })
  createdAt: Date;
  @ApiProperty({
    type: Date,
    description: 'Updated date',
  })
  updatedAt: Date;
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
  slug: string;
  @ApiProperty({
    type: String,
    description: 'Description of the lead',
  })
  description: string;
  searchText: string;
  @ApiProperty({
    type: String,
    description: 'DNI of the lead',
  })
  docId: string;
  @ApiProperty({
    type: String,
    description: 'Email of the lead',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'Telephone number of the lead',
  })
  telephone: string;
  @ApiProperty({
    type: String,
    description: 'TpId of the lead in Crm',
  })
  crmIdLead: string;
  @ApiProperty({
    type: String,
    description: 'AccountId of the lead in Crm',
  })
  crmAccountIdLead: string;
  @ApiProperty({
    type: String,
    description: 'Account password of the lead in Crm',
  })
  crmAccountPasswordLead: string;
  @ApiProperty({
    type: String,
    description: 'Trading platform id of the lead in Crm',
  })
  crmTradingPlatformAccountId: string;
  @ApiProperty({
    type: CategoryEntity,
    description: 'Department of the Crm',
  })
  crmDepartment: CategoryEntity;
  @ApiProperty({
    type: String,
    description: 'Url source of the lead is comming',
  })
  referral: string;
  integration: UserEntity;
  totalPayed: number;
  totalTransfer: number;
  partialFtdAmount: number;
  partialFtdDate: Date;
  quantityTransfer: number;
  showToAffiliate: boolean;
  hasSendDisclaimer: boolean;
  hasAddedCftd: boolean;
  hasAddedFtd: boolean;
  hasMoved: boolean;
  @ApiProperty({
    type: CategoryEntity,
    description: 'Type of source of the lead',
  })
  referralType: CategoryEntity | string;
  @ApiProperty({
    type: GroupEntity,
    description: 'Group of the lead',
  })
  group: GroupEntity;
  @ApiProperty({
    type: StatusEntity,
    description: 'Status of the lead in Affico360',
  })
  status: StatusEntity;
  @ApiProperty({
    type: Array<string>,
    description: 'Statuses of the lead in the CRM',
  })
  statusCrm: StatusEntity[];
  @ApiProperty({
    description: 'Date Contacted',
    type: Date,
  })
  dateContacted: Date;
  @ApiProperty({
    description: 'Date CFTD',
    type: Date,
  })
  dateCFTD: Date;
  @ApiProperty({
    description: 'Date FTD',
    type: Date,
  })
  dateFTD: Date;
  @ApiProperty({
    description: 'Date moved to retention',
    type: Date,
  })
  dateRetention: Date;
  personalData: PersonEntity;
  @ApiProperty({
    description: 'Country of the lead',
    enum: CountryCodeAfficoEnum,
    enumName: 'CountryList',
  })
  country: CountryCodeAfficoEnum;
  transfers: TransferEntity[];
  @ApiProperty({
    type: CrmEntity,
    description: 'CRM of the lead',
  })
  crm: CrmEntity;
  @ApiProperty({
    type: BusinessUnitEntity,
    description: 'Brand of the lead',
  })
  brand: BusinessUnitEntity;
  @ApiProperty({
    type: AffiliateEntity,
    description: 'Affiliate which register lead',
  })
  affiliate: AffiliateEntity;

  // Trackbox
  @ApiProperty({
    type: String,
    description: 'Ai param',
  })
  ai?: string;
  @ApiProperty({
    type: String,
    description: 'Ci param',
  })
  ci?: string;
  @ApiProperty({
    type: String,
    description: 'Gi param',
  })
  gi?: string;
  @ApiProperty({
    type: String,
    description: 'UserIp param',
  })
  userIp?: string;
  @ApiProperty({
    type: String,
    description: 'FirstName param',
  })
  firstname?: string;
  @ApiProperty({
    type: String,
    description: 'LastName param',
  })
  lastname?: string;
  @ApiProperty({
    type: String,
    description: 'Password param',
  })
  password?: string;
  @ApiProperty({
    type: String,
    description: 'Phone param',
  })
  phone?: string;
  @ApiProperty({
    type: String,
    description: 'So param',
  })
  so?: string;
  @ApiProperty({
    type: String,
    description: 'Sub param',
  })
  sub?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_1 param',
  })
  MPC_1?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_2 param',
  })
  MPC_2?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_3 param',
  })
  MPC_3?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_4 param',
  })
  MPC_4?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_5 param',
  })
  MPC_5?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_6 param',
  })
  MPC_6?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_7 param',
  })
  MPC_7?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_8 param',
  })
  MPC_8?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_9 param',
  })
  MPC_9?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_10 param',
  })
  MPC_10?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_11 param',
  })
  MPC_11?: string;
  @ApiProperty({
    type: String,
    description: 'Mpc_12 param',
  })
  MPC_12?: string;
  @ApiProperty({
    type: String,
    description: 'Ad param',
  })
  ad?: string;
  @ApiProperty({
    type: String,
    description: 'Term param',
  })
  keywords?: string;
  @ApiProperty({
    type: String,
    description: 'Campaign param',
  })
  campaign?: string;
  @ApiProperty({
    type: String,
    description: 'CampaignId param',
  })
  campaignId?: string;
  @ApiProperty({
    type: String,
    description: 'Medium param',
  })
  medium?: string;
  @ApiProperty({
    type: String,
    description: 'Comments param',
  })
  comments?: string;
  @ApiProperty({
    type: String,
    description: 'FunnelName param',
  })
  sourceId?: string;
  @ApiProperty({
    type: String,
    description: 'Response CRM',
  })
  responseCrm?: string;
}
