import { CommonService } from '@common/common';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserChangePasswordDto extends CreateAnyDto {
  @ApiProperty({
    description: 'Password User',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  @Matches(CommonService.patternPassword, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm Password User',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  @Matches(CommonService.patternPassword, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  confirmPassword: string;
}
