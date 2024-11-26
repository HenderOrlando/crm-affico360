import { ApiProperty } from '@nestjs/swagger';

export class TransferPspAccountResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of psp account',
    example: 'Name',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of psp account',
    example: 'Description',
  })
  description: string;
}
