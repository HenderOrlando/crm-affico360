import { BusinessUnitEntity } from '@business-unit/business-unit/entities/business-unit.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { CrmEntity } from '@crm/crm/entities/crm.entity';
import { LeadEntity } from '@lead/lead/entities/lead.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PspAccountEntity } from '@psp-account/psp-account/entities/psp-account.entity';
import { PspEntity } from '@psp/psp/entities/psp.entity';
import { StatusEntity } from '@status/status/entities/status.entity';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { ObjectId } from 'mongodb';
import { OperationTransactionType } from '../enum/operation.transaction.type.enum';
import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { PspResponse } from '../dto/transfer.latamcashier.response.dto';
import { UserEntity } from '@user/user/entities/user.entity';

export class TransferEntity implements TransferInterface {
  @ApiProperty({
    type: ObjectId,
    description: 'Transfer id',
  })
  id: ObjectId;
  _id: string;
  numericId: number;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  @ApiProperty({
    enum: CurrencyCodeAfficoEnum,
    enumName: 'currencyList',
    description: 'Transfer currency',
  })
  currency: CurrencyCodeAfficoEnum;
  operationType: OperationTransactionType;
  @ApiProperty({
    enum: CountryCodeEnum,
    enumName: 'countryList',
    description: 'Transfer country',
  })
  country: CountryCodeEnum;
  @ApiProperty({
    type: Number,
    description: 'Transfer amount',
  })
  // Amount in minimal units
  amount: number;
  leadEmail: string;
  leadTpId: string;
  leadAccountId: string;
  leadCrmName: string;
  leadCountry: CountryCodeEnum;
  leadName: string;
  leadTradingPlatformId: string;
  @ApiProperty({
    type: String,
    description: 'Id on PSP',
  })
  idPayment: string;
  @ApiProperty({
    type: String,
    description: 'Id on CRM',
  })
  crmTransactionId: string;
  @ApiProperty({
    type: JSON,
    description: 'Response of CRM transfer',
  })
  crmTransactionResponse: any;
  @ApiProperty({
    type: String,
    description: 'Status on PSP',
  })
  statusPayment: string;
  @ApiProperty({
    type: String,
    description: 'Description of status on PSP',
  })
  descriptionStatusPayment: string;
  urlPayment: string;
  responsePayment: PspResponse;
  responseCrm: any;
  lead: LeadEntity;
  affiliate: AffiliateEntity;
  status: StatusEntity;
  bank: CategoryEntity;
  department: CategoryEntity;
  typeTransaction: CategoryEntity;
  pspAccount: PspAccountEntity;
  psp: PspEntity;
  crm: CrmEntity;
  userCreator: UserEntity;
  userApprover: UserEntity;
  userRejecter: UserEntity;
  page: string;
  businessUnit: BusinessUnitEntity;
  confirmedAt: Date;
  hasChecked: boolean;
  hasApproved: boolean;
  checkedOnCashier: boolean;
  approvedAt: Date;
  rejectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
