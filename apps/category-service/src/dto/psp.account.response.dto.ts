import { ApiProperty } from '@nestjs/swagger';
import { PspAccountInterface } from '@psp-account/psp-account/entities/psp-account.interface';
import { IsString, IsOptional } from 'class-validator';

export class PspAccountResponseDto {
  constructor(pa: PspAccountInterface) {
    this.id = pa._id;
    this.code = pa.idCashier;
    this.name = pa.name;
    this.description = pa.name;
  }

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Id of psp account',
    example: '641a11cd77f0460f56d56beb',
  })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of psp account',
    example: 'ePayco account 1',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Code of psp account',
    example: '10',
  })
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Description of psp account',
    example: 'This is the ePayco account 1 ',
  })
  description: string;
}
