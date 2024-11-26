import { LeadCreateDto } from './lead.create.dto';
import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsMongoId,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class LeadUpdateDto extends PartialType(LeadCreateDto) {
  @IsMongoId()
  id: ObjectId;

  @IsOptional()
  @IsMongoId()
  affiliate?: ObjectId;

  @IsNumber()
  @IsOptional()
  totalPayed?: number;

  @IsNumber()
  @IsOptional()
  totalTransfer?: number;

  @IsNumber()
  @IsOptional()
  partialFtdAmount?: number;

  @IsDate()
  @IsOptional()
  partialFtdDate?: Date;

  @IsNumber()
  @IsOptional()
  quantityTransfer?: number;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  transfers?: ObjectId[];
}
