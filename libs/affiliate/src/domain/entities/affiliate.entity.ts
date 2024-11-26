import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { GroupEntity } from '@group/group/entities/group.entity';
import { IpAddressEntity } from '@ip-address/ip-address/entities/ip-address.entity';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PersonEntity } from '@person/person/entities/person.entity';
import { TrafficEntity } from '@traffic/traffic/entities/traffic.entity';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';
import { AffiliateInterface } from './affiliate.interface';

export class AffiliateEntity implements AffiliateInterface {
  _id?: ObjectId;
  id: ObjectId;
  @ApiProperty({
    type: String,
    description: 'Name of the affiliate',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Description of the affiliate',
  })
  slug: string;
  docId: string;
  email: string;
  slugEmail: string;
  telephone: string;
  description: string;
  searchText: string;
  // % leads conversion
  conversionCost: number;
  // # leads
  quantityLeads: number;
  // $ leads
  totalLeads: number;
  // # ftds
  quantityFtd: number;
  // $ ftds
  totalFtd: number;
  // # cftds
  quantityCftd: number;
  // $ cftds
  totalCftd: number;
  // % conversion
  totalConversion: number;
  // # ftds to show
  quantityAffiliateFtd: number;
  // $ ftds to show
  totalAffiliateFtd: number;
  // % conversion to show
  totalAffiliateConversion: number;
  publicKey: string;
  tradingPlatformId: string;
  organization: string;
  buOwnerId: string;
  crmIdAffiliate: string;
  crmApiKeyAffiliate: string;
  crmTokenAffiliate: string;
  crmDateToExpireTokenAffiliate: Date;
  crmUsernameAffiliate: string;
  crmPasswordAffiliate: string;
  isAdmin: boolean;
  user: UserEntity;
  leads: LeadEntity[];
  group: GroupEntity;
  affiliateGroup: GroupEntity;
  integrationGroup: GroupEntity;
  traffic: TrafficEntity;
  traffics: TrafficEntity[];
  personalData: PersonEntity;
  ipAllowed: IpAddressEntity[];
  businessUnit: BusinessUnitEntity;
  crm: CrmEntity;
  creator: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
