import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BlockTrafficSourcesDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  sources: string[];
}
