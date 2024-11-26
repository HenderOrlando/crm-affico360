import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Error number',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Error title',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Error description',
    example: "Affiliate isn't valid",
  })
  description: string;
}
