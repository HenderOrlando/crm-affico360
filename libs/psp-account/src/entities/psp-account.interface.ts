import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryInterface } from '@category/category/entities/category.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { StatusInterface } from '@status/status/entities/status.interface';
import { UserInterface } from '@user/user/entities/user.interface';

export interface PspAccountInterface {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  idCashier: string;
  searchText: string;
  token: string;
  apiKey: string;
  publicKey: string;
  privateKey: string;
  accountId: string;
  urlApi: string;
  urlSandbox: string;
  urlDashboard: string;
  username: string;
  password: string;
  urlRedirectToReceiveShortener: string;
  psp: PspInterface;
  bank: CategoryInterface;
  // Department
  department: CategoryInterface;
  quantityWithdrawal: number;
  totalWithdrawal: number;
  quantityPayments: number;
  quantityApprovedPayments: number;
  quantityRejectedPayments: number;
  totalPayments: number;
  totalApprovedPayments: number;
  totalRejectedPayments: number;
  approvedPercent: number;
  rejectedPercent: number;
  minDeposit: number;
  maxDeposit: number;
  timeoutToReceive: number;
  hasChecked: boolean;
  isRecurrent: boolean;

  quantityLeads: number;
  totalLeads: number;
  quantityFtd: number;
  totalFtd: number;
  quantityCftd: number;
  totalCftd: number;
  totalConversion: number;
  quantityAffiliateFtd: number;
  totalAffiliateFtd: number;
  totalAffiliateConversion: number;

  blackListCountries: CategoryInterface[];
  blackListBrands: BusinessUnitInterface[];
  blackListAffiliates: AffiliateInterface[];
  whiteListCountries: CategoryInterface[];
  whiteListBrands: BusinessUnitInterface[];
  whiteListAffiliates: AffiliateInterface[];
  status: StatusInterface;
  creator: UserInterface;
  createdAt: Date;
  updatedAt: Date;
}

export const PspAccountPropertiesRelations = [
  'psp',
  'bank',
  'department',
  'status',
  'creator',
  'blackListCountries',
  'blackListBrands',
  'blackListAffiliates',
  'whiteListCountries',
  'whiteListBrands',
  'whiteListAffiliates',
];

export const PspAccountPropertiesBasic = [
  'id',
  '_id',
  'name',
  'slug',
  'description',
  'idCashier',
  'searchText',
  'token',
  'apiKey',
  'publicKey',
  'privateKey',
  'accountId',
  'urlApi',
  'urlSandbox',
  'urlDashboard',
  'username',
  'password',
  'urlRedirectToReceiveShortener',
  'quantityWithdrawal',
  'totalWithdrawal',
  'quantityPayments',
  'quantityApprovedPayments',
  'quantityRejectedPayments',
  'totalPayments',
  'totalApprovedPayments',
  'totalRejectedPayments',
  'approvedPercent',
  'rejectedPercent',
  'minDeposit',
  'maxDeposit',
  'timeoutToReceive',
  'hasChecked',
  'isRecurrent',
  'quantityLeads',
  'totalLeads',
  'quantityFtd',
  'totalFtd',
  'quantityCftd',
  'totalCftd',
  'totalConversion',
  'quantityAffiliateFtd',
  'totalAffiliateFtd',
  'totalAffiliateConversion',
  'createdAt',
  'updatedAt',
];
