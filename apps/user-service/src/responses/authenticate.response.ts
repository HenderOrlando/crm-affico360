import { IsString } from 'class-validator';

export class AuthenticatedResponse {
  @IsString()
  access_token: string;
}
