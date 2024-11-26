import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmpty,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { OperationTransactionType } from '../enum/operation.transaction.type.enum';

export class TransferCreateDto extends CreateAnyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEmpty()
  searchText: string;

  @IsNotEmpty()
  @IsEnum(CurrencyCodeAfficoEnum)
  @ApiProperty({
    required: true,
    enum: CurrencyCodeAfficoEnum,
    enumName: 'CurrencyList',
    description: 'Transfer currency',
    example: 'approved',
  })
  currency: CurrencyCodeAfficoEnum;

  @IsEmpty()
  numericId: number;
  @IsEmpty()
  @ApiProperty({
    required: true,
    enum: OperationTransactionType,
    enumName: 'OperationList',
    description: 'Type of transfer create. Could be an id of a name',
    example: OperationTransactionType.deposit,
  })
  operationType: OperationTransactionType;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Transfer amount',
    example: 100,
  })
  amount: number;

  @IsOptional()
  country?: CountryCodeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Id of lead. Could be an id of a tpId',
    examples: ['641a11cd77f0460f56d56beb', '987654'],
  })
  lead: ObjectId;

  @IsEmpty()
  leadEmail: string;

  @IsEmpty()
  leadTpId: string;

  @IsEmpty()
  leadAccountId: string;

  @IsEmpty()
  leadCrmName: string;

  leadName: string;

  leadTradingPlatformId: string;

  @IsEmpty()
  crmTransactionId: string;

  @IsEmpty()
  leadCountry: CountryCodeEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description:
      'PspAccount to execute the transfer. Could be an id of a name ',
    examples: ['641a11cd77f0460f56d56beb', 'ePayco account 1'],
  })
  pspAccount: ObjectId;

  @IsMongoId()
  //@IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Type of transfer create. Could be an id of a name',
    examples: ['641a11cd77f0460f56d56beb', 'Cash'],
  })
  typeTransaction: ObjectId;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    description: 'URL of the transfer create',
    example: 'https://www.psp-page.com',
  })
  page: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Id of the transfer on PSP',
    example: '641a11cd77f0460f56d56beb',
  })
  idPayment: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Status initial of the transfer',
    example: 'rejected',
  })
  statusPayment: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Description of the status of the transfer on PSP',
    example: 'Rejected, credit card without quota',
  })
  descriptionStatusPayment: string;

  @IsString()
  @IsOptional()
  urlPayment: string;

  @IsBoolean()
  @IsOptional()
  hasApproved: boolean;

  @IsMongoId()
  @IsOptional()
  status: ObjectId;

  @IsEmpty()
  affiliate: ObjectId | string;

  @IsEmpty()
  responsePayment?: any;

  @IsEmpty()
  responseCrm?: any;

  @IsMongoId()
  @IsOptional()
  department: ObjectId;

  @IsMongoId()
  @IsOptional()
  psp: ObjectId;

  @IsMongoId()
  @IsOptional()
  bank: ObjectId;

  @IsMongoId()
  @IsOptional()
  businessUnit: ObjectId;

  @IsMongoId()
  @IsOptional()
  crm: ObjectId;

  @IsMongoId()
  @IsOptional()
  userCreator: ObjectId;

  @IsMongoId()
  @IsOptional()
  userApprover: ObjectId;

  @IsMongoId()
  @IsOptional()
  userRejecter: ObjectId;

  @IsDate()
  @IsOptional()
  confirmedAt: Date;

  @IsEmpty()
  approvedAt: Date;

  @IsEmpty()
  rejectedAt: Date;

  @IsBoolean()
  isManualTx = false;

  @IsBoolean()
  checkedOnCashier = false;
}
