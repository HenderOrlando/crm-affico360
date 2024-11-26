import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { ScopeDto } from '@permission/permission/dto/scope.dto';
import TransportEnum from '@common/common/enums/TransportEnum';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageCreateDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsMongoId()
  category: ObjectId;

  @IsNotEmpty()
  @Type(() => ScopeDto)
  origin: ScopeDto;

  @IsNotEmpty()
  @Type(() => ScopeDto)
  destiny: ScopeDto;

  @IsNotEmpty()
  @IsMongoId()
  status: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  creator: ObjectId;

  @IsNotEmpty()
  @IsEnum(TransportEnum)
  transport: TransportEnum;
}
