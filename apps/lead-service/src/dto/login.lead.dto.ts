import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginLeadDto extends CreateAnyDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'TpId | email of lead',
    example: '123456 | jhondoe@email.com',
  })
  @IsString()
  username: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Password of lead',
    example: '123Abc',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'ApiKey from affiliate query',
    example: '$2b$08$IKCYAablfH51qMaOzlgq/uhrLLvdgLJWSh50O6Tfk7a0NAycjSW7i',
  })
  @IsString()
  @IsOptional()
  apiKey: string;
}
