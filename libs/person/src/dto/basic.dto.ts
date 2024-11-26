import { IsOptional, IsString } from 'class-validator';

export default class BasicDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
