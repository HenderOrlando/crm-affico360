import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ScopeDto } from './scope.dto';
import { TimeLiveDto } from './time.live.dto';
import { ConfigPermissionDto } from './config.permissions.dto';

export class PermissionCreateDto extends CreateAnyDto {
  @ApiProperty({
    description: 'Permission name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Permission description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Permission Actions',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ActionsEnum)
  action: ActionsEnum;

  @ApiProperty({
    description: 'Permission Resources',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ResourcesEnum)
  resource: ResourcesEnum;

  @ApiProperty({
    description: 'Json Object Dto',
    type: ScopeDto,
  })
  @IsObject()
  @IsOptional()
  @Type(() => ScopeDto)
  scope?: ScopeDto;

  @IsEmpty()
  scopeDto?: ScopeDto;

  @ApiProperty({
    description: 'Json Object Dto',
    type: ScopeDto,
  })
  @IsObject()
  @IsOptional()
  @Type(() => ConfigPermissionDto)
  config?: ConfigPermissionDto;

  @IsEmpty()
  @Type(() => TimeLiveDto)
  timeLive: TimeLiveDto;

  // TODO[hender] Check the hash method implemented
  @IsEmpty()
  code: string;
}
