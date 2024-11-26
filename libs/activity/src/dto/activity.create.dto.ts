import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';

export class ActivityCreateDto extends CreateAnyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsEnum(ActionsEnum)
  action: ActionsEnum;

  @IsNotEmpty()
  //@Transform(({ value }) => JSON.parse(value))
  object: any;

  @IsOptional()
  //@Transform(({ value }) => JSON.parse(value))
  objectBefore: any;

  @IsOptional()
  @IsString()
  creator: ObjectId;

  @IsOptional()
  @IsString()
  category: ObjectId;

  @IsOptional()
  @IsEnum(ResourcesEnum)
  resource: ResourcesEnum;
}
