import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import { ApiProperty } from '@nestjs/swagger';
import { TransferDocument } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { TransferBankResponse } from './transfer.bank.response.dto';
import { TransferDepartmentResponse } from './transfer.department.response.dto';
import { TransferLeadResponse } from './transfer.lead.response.dto';
import { TransferPspAccountResponse } from './transfer.psp.account.response.dto';
import { TransferPspResponse } from './transfer.psp.rResponse.dto';
import { TransferStatusResponse } from './transfer.status.response.dto';
import { TransferTypeTransactionResponse } from './transfer.type.transaction.response.dto';

export class TransferAffiliateResponseDto {
  constructor(transfer: TransferDocument) {
    this.id = transfer.id;
    this.numericId = transfer.numericId;
    this.subject = transfer.name;
    this.summary = transfer.description;
    this.currency = transfer.currency;
    this.country = transfer.country;
    this.amount = transfer.amount;
    this.idPayment = transfer.idPayment;
    this.statusPayment = transfer.statusPayment;
    this.descriptionStatusPayment = transfer.descriptionStatusPayment;
    this.urlPayment = transfer.urlPayment;
    this.lead = {
      name: transfer.lead?.name,
      email: transfer.leadEmail,
      tpId: transfer.leadTpId,
      crmName: transfer.leadCrmName,
      country: transfer.leadCountry,
    };
    this.status = {
      name: transfer.status.name,
      description: transfer.status.description,
    };
    this.bank = {
      name: transfer.bank?.name,
      description: transfer.bank?.description,
    };
    this.department = {
      name: transfer.department?.name,
      description: transfer.department?.description,
    };
    this.typeTransaction = {
      name: transfer.typeTransaction?.name,
      description: transfer.typeTransaction?.description,
    };
    this.pspAccount = {
      name: transfer.pspAccount?.name,
      description: transfer.pspAccount?.description,
    };
    this.psp = {
      name: transfer.psp?.name,
      description: transfer.psp?.description,
    };
    this.page = transfer.page;
    this.confirmedAt = transfer.confirmedAt;
    this.hasChecked = transfer.hasChecked;
    this.hasApproved = transfer.hasApproved;
    this.approvedAt = transfer.approvedAt;
    //TODO[hender - 2024/02/19] ConfirmedAt updated to response
    //this.confirmedAt = transfer.confirmedAt;
    this.rejectedAt = transfer.rejectedAt;
    this.createdAt = transfer.createdAt;
  }
  @ApiProperty({
    required: false,
    type: String,
    description: 'Id of the transfer',
    example: '643caa982a45efbd76c044e8',
  })
  id: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Numeric Id of the transfer',
    example: '987654321',
  })
  numericId: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Subject of the transfer',
    example: 'Pay to save in crypto',
  })
  subject: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Description of the transfer',
    example: 'The lead pay 1/6 fee',
  })
  summary: string;

  @ApiProperty({
    required: false,
    enum: CurrencyCodeAfficoEnum,
    enumName: 'CurrencyCode',
    description: 'Currency of the transfer. Default USD',
    example: 'USD',
  })
  currency: CurrencyCodeAfficoEnum;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Country of the transfer',
    example: 'MX',
  })
  country: CountryCodeEnum;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Amount of transfer in dollars',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Id of transfer in PSP',
    example: 'https://google.com',
  })
  idPayment: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Status of transfer in PSP',
    example: 'https://google.com',
  })
  statusPayment: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of the status of the transfer on PSP',
    example: 'Rejected, credit card without quota',
  })
  descriptionStatusPayment: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Url of PSP pay this transfer',
    example: 'https://google.com',
  })
  urlPayment: string;

  @ApiProperty({
    required: false,
    type: TransferLeadResponse,
    description: 'Lead to pay the transfer',
    example: {
      name: 'Name of lead',
      email: 'Lead email',
      tpId: '654321987',
      crmName: 'Crm name',
      country: 'CO',
    },
  })
  lead: TransferLeadResponse;

  @ApiProperty({
    required: false,
    type: TransferStatusResponse,
    description: 'Current status of transfer',
    example: {
      name: 'Pending',
      description: 'Status withing by confirmation',
    },
  })
  status: TransferStatusResponse;

  @ApiProperty({
    required: false,
    type: TransferBankResponse,
    description: 'Bank used. The PspAccount bank is default',
    example: {
      name: 'HSBC',
      description: 'Banco Hong Kong and Shanghai Banking Corporation',
    },
  })
  bank: TransferBankResponse;

  @ApiProperty({
    required: false,
    type: TransferDepartmentResponse,
    description: 'Department to save transfer',
    example: {
      name: 'Retention',
      description: 'Retention department',
    },
  })
  department: TransferDepartmentResponse;

  @ApiProperty({
    required: false,
    type: TransferTypeTransactionResponse,
    description: 'Type of transaction',
    example: {
      name: 'Cash',
      description: 'Cash transaction',
    },
  })
  typeTransaction: TransferTypeTransactionResponse;

  @ApiProperty({
    required: false,
    type: TransferPspAccountResponse,
    description: 'Url page from payment execute',
    example: {
      name: 'ePayco account 1',
      description: 'ePayco account 1 description',
    },
  })
  pspAccount: TransferPspAccountResponse;

  @ApiProperty({
    required: false,
    type: TransferPspResponse,
    description: 'Psp to execute the transfer',
    example: {
      name: 'ePayco',
      description: 'ePayco description',
    },
  })
  psp: TransferPspResponse;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Url page from start the transfer',
    example: 'https://google.com',
  })
  page: string;

  @ApiProperty({
    required: false,
    type: Date,
    description: 'Date confirmed transfer',
    example: new Date(),
  })
  confirmedAt: Date;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'If was checked transfer',
    example: true,
  })
  hasChecked: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'If was approved (true) or rejected (false) transfer',
    example: false,
  })
  hasApproved: boolean;

  @ApiProperty({
    required: false,
    type: Date,
    description: 'Transfer approval date',
    example: new Date(),
  })
  approvedAt: Date;

  @ApiProperty({
    required: true,
    type: Date,
    description: 'Transfer rejection date',
    example: new Date(),
  })
  rejectedAt: Date;

  @ApiProperty({
    required: true,
    type: Date,
    description: 'Transfer creation date',
    example: new Date(),
  })
  createdAt: Date;
}
