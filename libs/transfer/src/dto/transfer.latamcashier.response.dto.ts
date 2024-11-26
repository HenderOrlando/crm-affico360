import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PayloadLatamCashierResponse {
  @IsString()
  @IsOptional()
  url: string;
  @IsString()
  @IsOptional()
  message: string;
  @IsString()
  @IsOptional()
  type: string;
}

export class PspResponse {
  @IsOptional()
  @IsBoolean()
  success: boolean;
  @IsOptional()
  @IsString()
  message: string;
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PayloadLatamCashierResponse)
  payload: PayloadLatamCashierResponse;
}
