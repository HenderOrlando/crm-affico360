import { IsOptional, IsString } from 'class-validator';
import { UserResponseDto as UserResponseDto } from '../../generic/dto/user.response.dto';

export class LeverateRegisterResponseDto extends UserResponseDto {
  @IsOptional()
  @IsString()
  accountId: string;

  @IsOptional()
  @IsString()
  tpAccountName: string;

  @IsOptional()
  @IsString()
  tpAccountPassword: string;
}
