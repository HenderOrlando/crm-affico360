import { BusinessUnitInterface } from '@business-unit/business-unit/entities/business-unit.interface';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { CategoryInterface } from '@category/category/entities/category.interface';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { PspAccountInterface } from '@psp-account/psp-account/entities/psp-account.interface';
import { PspInterface } from '@psp/psp/entities/psp.interface';
import { StatusEntity } from '@status/status/entities/status.entity';
import { ObjectId } from 'mongoose';
import { OperationTransactionType } from '../enum/operation.transaction.type.enum';
import { AffiliateInterface } from '@affiliate/affiliate/domain/entities/affiliate.interface';
import { PspResponse } from '../dto/transfer.latamcashier.response.dto';
import { UserInterface } from '@user/user/entities/user.interface';

export interface TransferInterface {
  _id: string;
  id: ObjectId;
  numericId: number;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  currency: CurrencyCodeAfficoEnum;
  operationType: OperationTransactionType;
  country: CountryCodeEnum;
  // Amount in minimal units
  amount: number;
  leadEmail: string;
  leadTpId: string;
  leadAccountId: string;
  leadCrmName: string;
  leadCountry: CountryCodeEnum;
  leadName: string;
  leadTradingPlatformId: string;
  crmTransactionId: string;
  crmTransactionResponse: any;
  idPayment: string;
  statusPayment: string;
  descriptionStatusPayment: string;
  urlPayment: string;
  responsePayment: PspResponse;
  responseCrm: any;
  lead: LeadEntity;
  affiliate: AffiliateInterface;
  status: StatusEntity;
  bank: CategoryEntity;
  department: CategoryInterface;
  typeTransaction: CategoryInterface;
  pspAccount: PspAccountInterface;
  psp: PspInterface;
  crm: CrmInterface;
  userCreator: UserInterface;
  userApprover: UserInterface;
  userRejecter: UserInterface;
  page: string;
  businessUnit: BusinessUnitInterface;
  confirmedAt: Date;
  hasChecked: boolean;
  hasApproved: boolean;
  checkedOnCashier: boolean;
  approvedAt: Date;
  rejectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
export const TransferPropertiesRelations = [
  'lead',
  'affiliate',
  'status',
  'bank',
  'department',
  'typeTransaction',
  'pspAccount',
  'psp',
  'crm',
  'businessUnit',
];

export const TransferPropertiesBasic = [
  '_id',
  'numericId',
  'name',
  'slug',
  'description',
  'searchText',
  'currency',
  'operationType',
  'country',
  'amount',
  'leadEmail',
  'leadTpId',
  'leadAccountId',
  'leadCrmName',
  'leadCountry',
  'leadName',
  'leadTradingPlatformId',
  'crmTransactionId',
  'idPayment',
  'statusPayment',
  'descriptionStatusPayment',
  'urlPayment',
  'lead',
  'page',
  'confirmedAt',
  'hasChecked',
  'hasApproved',
  'checkedOnCashier',
  'approvedAt',
  'rejectedAt',
  'createdAt',
  'updatedAt',
];
