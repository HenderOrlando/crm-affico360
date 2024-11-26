import { PartialType } from '@nestjs/mapped-types';
import { CategoryCreateDto } from './category.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {
  @IsMongoId()
  id: ObjectId;
}
