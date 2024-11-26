import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AutologinLeadResponse extends CreateAnyDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Url to autologin',
    example: 'https://domain.com/',
  })
  @IsString()
  url: string;
}
