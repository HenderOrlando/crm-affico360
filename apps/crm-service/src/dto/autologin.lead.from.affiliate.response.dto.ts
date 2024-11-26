import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AutologinLeadFromAffiliateResponseDto extends CreateAnyDto {
  type: string;
  @ApiProperty({
    type: String,
    description: 'Url to redirec',
    example: 'https://domain.com/',
  })
  @IsString()
  url: string;
}
