import { IsInt, IsOptional, IsString } from 'class-validator';

export class AntelopeApiErrorDto implements AntelopeApiErrorDto {
  // Returns the error code for the exception ,
  @IsInt()
  @IsOptional()
  errorCode: number;

  // The basic meaning of the exception ,
  @IsString()
  @IsOptional()
  errorDesc: string;

  // The spesific reason for exception
  @IsOptional()
  @IsString()
  errorDetails: string;
}
