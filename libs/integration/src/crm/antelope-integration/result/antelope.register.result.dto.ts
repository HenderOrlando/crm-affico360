import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AntelopeApiUserResultDto } from './antelope.api.user.result.dto';
import { AntelopeApiErrorDto } from './antelope.api.error.dto';
import { UserResponseDto } from '../../generic/dto/user.response.dto';

export class AntelopeRegisterResultDto extends UserResponseDto {
  // Returns 'true' if the process was completed successfully ,
  @IsOptional()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @ValidateNested()
  result: AntelopeApiUserResultDto;

  // UUID of request used to debug issues with the api ,
  @IsString()
  @IsOptional()
  requestId: string;

  @IsOptional()
  @ValidateNested()
  error: AntelopeApiErrorDto;
}
