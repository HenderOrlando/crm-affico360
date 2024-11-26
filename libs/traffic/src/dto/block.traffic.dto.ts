import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BlockTrafficDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  data: any[];
}
