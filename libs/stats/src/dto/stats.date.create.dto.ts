import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BusinessUnit } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import PeriodEnum from '@common/common/enums/PeriodEnum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { PspAccount } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { Psp } from '@psp/psp/entities/mongoose/psp.schema';
import { Transfer } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class StatsDateCreateDto extends CreateAnyDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  slug: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsEmpty()
  searchText: string;
  @IsNotEmpty()
  @IsEnum(PeriodEnum)
  period: PeriodEnum;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityLeads = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityLeadsDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalLeads = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalLeadsDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalLeads = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalLeadsDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalLeads = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalLeadsDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalLeads = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalLeadsDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityFtd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityFtdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalFtd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalFtdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalFtd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalFtdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalFtd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalFtdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalFtd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalFtdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityCftd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityCftdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalCftd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalCftdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalCftd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalCftdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalCftd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalCftdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalCftd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalCftdDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedLead = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedLeadDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedLead = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedLeadDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedLead = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedLeadDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedLead = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedLeadDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalApprovedLead = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalApprovedLeadDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionApprovedLead = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionRetention = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionCftd = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionApprovedLeadDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  quantityApprovedTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  totalApprovedTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  maxTotalApprovedTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  minTotalApprovedTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalApprovedTransfer = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  averageTotalApprovedTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionApprovedv = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionApprovedTransferDatabase = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversion = 0;
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  conversionDatabase = 0;
  // Date createdAt
  dateCheck: Date;
  // Date dateCFTD
  dateCheckCFTD: Date;
  // Date dateFTD
  dateCheckFTD: Date;
  // Date dateRetention
  dateCheckRetention: Date;
  // Date dateApprovedAt
  dateCheckApprovedAt: Date;
  // Date dateConfirmedAt
  dateCheckConfirmedAt: Date;
  @IsOptional()
  @IsMongoId()
  sourceType: ObjectId | Category;
  @IsOptional()
  @IsMongoId()
  affiliate: ObjectId | Affiliate;
  @IsOptional()
  @IsMongoId()
  brand: ObjectId | BusinessUnit;
  @IsOptional()
  @IsMongoId()
  crm: ObjectId | Crm;
  @IsOptional()
  @IsMongoId()
  pspAccount: ObjectId | PspAccount;
  @IsOptional()
  @IsMongoId()
  psp: ObjectId | Psp;
  @IsOptional()
  @IsMongoId()
  department: ObjectId | Category;
  @IsOptional()
  @IsMongoId()
  lead: ObjectId | Lead;
  @IsOptional()
  @IsMongoId()
  transfer: ObjectId | Transfer;
  @IsOptional()
  @IsMongoId({ each: true })
  leads: ObjectId[] | Lead[];
  @IsOptional()
  @IsMongoId({ each: true })
  transfers: ObjectId[] | Transfer[];
  @IsNotEmpty()
  @IsEnum(CountryCodeEnum)
  country: CountryCodeEnum;
  @IsNotEmpty()
  @IsEnum(OperationTransactionType)
  operationType: OperationTransactionType;
  createdAt: Date;
  updatedAt: Date;
}
