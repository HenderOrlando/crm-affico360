import { CategoryDocument } from '@category/category/entities/mongoose/category.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    type: String,
    description: 'Id of the category',
    example: '641a11cd77f0460f56d56be6',
  })
  id: string;
  @ApiProperty({
    type: String,
    description: 'Number of the category',
    example: 'Name',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Description of the category',
    example: 'Description',
  })
  description: string;
  @ApiProperty({
    type: Number,
    description: 'Code number of the category',
    example: 1,
  })
  code: number;
  @ApiProperty({
    type: String,
    description: 'Abbreviation of the category',
    example: 10,
  })
  shortName: string;
  constructor(data: CategoryDocument) {
    this.id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.code = data.valueNumber;
    this.shortName = data.valueText;
  }
}
