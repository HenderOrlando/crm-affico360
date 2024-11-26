import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AutologinLeadDto extends CreateAnyDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'TpId | email of lead',
    example: '123456 | jhondoe@email.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Password of lead',
    example: '123Abc',
  })
  @IsString()
  password: string;
}
