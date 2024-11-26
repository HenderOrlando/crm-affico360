import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class TransferUpdateWithdrawalDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Transfer ID in Affico360',
    example: 'qwertyuiopasdfghjkl1234567890zxcvbnm',
  })
  id: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Transfer ID in PSP',
    example: 'qwertyuiopasdfghjkl1234567890zxcvbnm',
  })
  idPayment: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Status of the transfer in PSP',
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
