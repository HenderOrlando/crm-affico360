import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';

export class LeadPspCreateDto extends CreateAnyDto {
  @ApiProperty({
    description: 'lead name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Lead description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  psp: ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  lead: ObjectId;

  @IsOptional()
  @IsMongoId()
  status?: ObjectId;

  @ApiProperty({
    description: 'Transaction currency',
  })
  @IsEnum(CurrencyCodeAfficoEnum)
  @IsOptional()
  currency: CurrencyCodeAfficoEnum;

  @ApiProperty({
    description: 'Transaction amount',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
