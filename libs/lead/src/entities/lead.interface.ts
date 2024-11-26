import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { GroupInterface } from '@group/group/entities/group.interface';
import { PersonInterface } from '@person/person/entities/PersonInterface';
import { StatusInterface } from '@status/status/entities/status.interface';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { UserInterface } from '@user/user/entities/user.interface';
import { ObjectId } from 'mongodb';

export interface LeadInterface {
  _id?: ObjectId;
  id: ObjectId;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  docId: string;
  email: string;
  telephone: string;
  crmIdLead: string;
  crmAccountIdLead: string;
  crmAccountPasswordLead: string;
  crmTradingPlatformAccountId: string;
  crmDepartment: CategoryInterface;
  referral: string;
  integration: UserInterface;
  totalPayed: number;
  totalTransfer: number;
  partialFtdAmount: number;
  partialFtdDate: Date;
  quantityTransfer: number;
  showToAffiliate: boolean;
  hasSendDisclaimer: boolean;
  hasMoved?: boolean;
  hasAddedCftd: boolean;
  hasAddedFtd: boolean;
  referralType: CategoryInterface | string;
  group: GroupInterface;
  status: StatusInterface;
  statusCrm: StatusInterface[];
  personalData: PersonInterface;
  country: CountryCodeAfficoEnum;
  transfers: TransferInterface[];
  crm: CrmInterface;
  brand: BusinessUnitInterface;
  affiliate: AffiliateInterface;
  createdAt: Date;
  updatedAt: Date;
  dateContacted: Date;
  dateCFTD: Date;
  dateFTD: Date;
  dateRetention: Date;
  // Trackbox
  ai?: string;
  ci?: string;
  gi?: string;
  userIp?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  phone?: string;
  so?: string;
  sub?: string;
  MPC_1?: string;
  MPC_2?: string;
  MPC_3?: string;
  MPC_4?: string;
  MPC_5?: string;
  MPC_6?: string;
  MPC_7?: string;
  MPC_8?: string;
  MPC_9?: string;
  MPC_10?: string;
  MPC_11?: string;
  MPC_12?: string;
  ad?: string;
  keywords?: string;
  campaign?: string;
  campaignId?: string;
  medium?: string;
  comments?: string;
  sourceId?: string;
  responseCrm?: string;
}

export const LeadPropertiesRelations = [
  'crmDepartment',
  'integration',
  'referralType',
  'group',
  'status',
  'statusCrm',
  'personalData',
  'transfers',
  'crm',
  'brand',
  'affiliate',
];

export const LeadPropertiesBasic = [
  '_id',
  'id',
  'name',
  'slug',
  'description',
  'searchText',
  'docId',
  'email',
  'telephone',
  'crmIdLead',
  'crmAccountIdLead',
  'crmAccountPasswordLead',
  'crmTradingPlatformAccountId',
  'referral',
  'totalPayed',
  'totalTransfer',
  'quantityTransfer',
  'showToAffiliate',
  'hasSendDisclaimer',
  'hasMoved',
  'hasAddedCftd',
  'hasAddedFtd',
  'country',
  'createdAt',
  'updatedAt',
  'dateContacted',
  'dateCFTD',
  'dateFTD',
  'dateRetention',
  '//',
  'ai',
  'ci',
  'gi',
  'userIp',
  'firstname',
  'lastname',
  'password',
  'phone',
  'so',
  'sub',
  'MPC_1',
  'MPC_2',
  'MPC_3',
  'MPC_4',
  'MPC_5',
  'MPC_6',
  'MPC_7',
  'MPC_8',
  'MPC_9',
  'MPC_10',
  'MPC_11',
  'MPC_12',
  'ad',
  'keywords',
  'campaign',
  'campaignId',
  'medium',
  'comments',
  'sourceId',
  'responseCrm',
];
