import { ApiProperty } from '@nestjs/swagger';

export class TransferStatusResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of status',
    example: 'Name',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of status',
    example: 'Description',
  })
  description: string;
}
