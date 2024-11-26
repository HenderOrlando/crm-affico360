import { ApiProperty } from '@nestjs/swagger';

export class TransferBankResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of bank',
    example: 'Name',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of bank',
    example: 'Description',
  })
  description: string;
}
