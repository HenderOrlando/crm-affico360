import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutologinLeadDto } from 'apps/lead-service/src/dto/autologin.lead.dto';
import { IsString } from 'class-validator';

export class AutologinLeadFromAffiliateDto extends CreateAnyDto {
  constructor(autologinLead: AutologinLeadDto, affiliateId: string) {
    super();
    Object.assign(this, autologinLead);
    this.affiliateId = affiliateId;
    this.type = 'local';
  }
  type: string;
  @ApiProperty({
    required: true,
    type: String,
    description: 'TpId | email of lead',
    example: '123456 | jhondoe@email.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Password of lead',
    example: '123Abc',
  })
  @IsString()
  password: string;

  @IsString()
  affiliateId: string;
}
