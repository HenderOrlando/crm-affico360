import { ApiProperty } from '@nestjs/swagger';

export class TransferPspResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of psp',
    example: 'Name',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of psp',
    example: 'Description',
  })
  description: string;
}
