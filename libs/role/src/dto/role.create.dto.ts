import { PermissionUpdateDto } from '@permission/permission/dto/permission.update.dto';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class RoleCreateDto extends CreateAnyDto {
  @ApiProperty({
    description: 'Role Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Role Name',
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  codes?: Array<string>;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Role Description',
  })
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  active = true;

  @IsOptional()
  @IsMongoId({ each: true })
  permissions: ObjectId[];
}
