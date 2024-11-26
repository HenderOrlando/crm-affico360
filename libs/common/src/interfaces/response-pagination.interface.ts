import { ApiProperty } from '@nestjs/swagger';

export class ResponsePaginator<TBasicEntity> {
  @ApiProperty({
    type: Number,
    description: 'Number of next page',
    example: 2,
  })
  nextPage: number;
  @ApiProperty({
    type: Number,
    description: 'Number of previous page',
    example: 1,
  })
  prevPage: number;
  @ApiProperty({
    type: Number,
    description: 'Number of last page',
    example: 2,
  })
  lastPage: number;
  @ApiProperty({
    type: Number,
    description: 'Number of first page',
    example: 2,
  })
  firstPage: number;
  @ApiProperty({
    type: Number,
    description: 'Number of current page',
    example: 2,
  })
  currentPage: number;
  @ApiProperty({
    type: Number,
    description: 'Number total of elements',
    example: 2,
  })
  totalElements: number;
  @ApiProperty({
    type: Number,
    description: 'Number of elements per page',
    example: 2,
  })
  elementsPerPage: number;
  @ApiProperty({
    type: Number,
    description: 'Order apply to search',
    example: 2,
  })
  order: Array<string>;
  @ApiProperty({
    type: Array<TBasicEntity>,
    description: 'List of elements',
    example: [],
  })
  list: TBasicEntity[];
}
