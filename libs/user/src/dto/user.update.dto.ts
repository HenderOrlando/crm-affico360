import { PartialType } from '@nestjs/mapped-types';
import { ObjectId } from 'mongodb';
import { UserCreateDto } from '@user/user/dto/user.create.dto';
import { IsMongoId } from 'class-validator';

export class UserUpdateDto extends PartialType(UserCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
