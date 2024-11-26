import { ApiProperty } from '@nestjs/swagger';

export class TransferTypeTransactionResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of type transaction',
    example: 'Name',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of type transaction',
    example: 'Description',
  })
  description: string;
}
