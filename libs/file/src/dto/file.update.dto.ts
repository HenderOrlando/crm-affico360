import { PartialType } from '@nestjs/mapped-types';
import { FileCreateDto } from './file.create.dto';
import { IsOptional } from 'class-validator';

export class FileUpdateDto extends PartialType(FileCreateDto) {
  id: string;

  @IsOptional()
  isFirst?: boolean;

  @IsOptional()
  name?: string;

  @IsOptional()
  path?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  mimetype?: string;

  @IsOptional()
  data: string;

  @IsOptional()
  onlyHeaders?: boolean = false;
}
