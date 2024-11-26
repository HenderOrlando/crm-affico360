import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ScopeDto extends CreateAnyDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  resourceId: ObjectId;

  @IsNotEmpty()
  @IsEnum(ResourcesEnum)
  resourceName: ResourcesEnum;
}
