import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TransferUpdateDepositDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Id of the transfer in Affico360',
    example: 'qwertyuiopasdfghjkl1234567890zxcvbnm',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Id of the transfer on PSP',
    example: 'qwertyuiopasdfghjkl1234567890zxcvbnm',
  })
  idPayment: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Status of the transfer on PSP',
    example: 'rejected',
  })
  statusPayment: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of the status of the transfer on PSP',
    example: 'Rejected, credit card without quota',
  })
  descriptionStatusPayment: string;
}
