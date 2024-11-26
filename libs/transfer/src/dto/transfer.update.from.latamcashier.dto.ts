import { StatusCashierEnum } from '@common/common/enums/StatusCashierEnum';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PspResponse } from './transfer.latamcashier.response.dto';

export class TransferUpdateFromLatamCashierDto {
  @IsOptional()
  @IsEnum(StatusCashierEnum)
  status: StatusCashierEnum;

  @IsOptional()
  @Type(() => PspResponse)
  @ValidateNested({ each: true })
  pspInformation: PspResponse;

  @IsOptional()
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  userId: string;
}
