import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TransferLeadResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of lead',
    example: 'Name of lead',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Email of lead',
    example: 'email_lead@email.com',
  })
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'TpId of lead',
    example: '8878040',
  })
  tpId: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Crm name of lead',
    example: 'Crm name',
  })
  crmName: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Country of lead',
    example: 'MX',
  })
  country: CountryCodeEnum;
}
