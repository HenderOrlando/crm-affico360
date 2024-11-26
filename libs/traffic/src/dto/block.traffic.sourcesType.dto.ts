import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BlockTrafficSourcesTypeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  sourcesType: string[];
}
