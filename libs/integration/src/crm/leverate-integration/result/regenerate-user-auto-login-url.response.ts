import { IsOptional, IsString } from 'class-validator';
import { UserResponseDto as UserResponseDto } from '../../generic/dto/user.response.dto';

export class LeverateRegenerateUserAutoLoginUrlDto extends UserResponseDto {
  @IsOptional()
  @IsString()
  jwt: string;

  url: string;
}
