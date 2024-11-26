import { ApiProperty } from '@nestjs/swagger';

export class TransferDepartmentResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of department',
    example: 'Name',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of department',
    example: 'Description',
  })
  description: string;
}
