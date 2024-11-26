import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { PspAccountInterface } from '@psp-account/psp-account/entities/psp-account.interface';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';

export class PspAccountEntity implements PspAccountInterface {
  id: ObjectId;
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

  psp: PspEntity;
  bank: CategoryEntity;
  // Department
  department: CategoryEntity;
  blackListCountries: CategoryEntity[];
  blackListBrands: BusinessUnitEntity[];
  blackListAffiliates: AffiliateEntity[];
  whiteListCountries: CategoryEntity[];
  whiteListBrands: BusinessUnitEntity[];
  whiteListAffiliates: AffiliateEntity[];
  status: StatusEntity;
  creator: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
