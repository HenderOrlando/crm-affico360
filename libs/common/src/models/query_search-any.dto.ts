import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class QuerySearchAnyDto {
  @IsString()
  @IsOptional()
  searchText?: string;
  // params to view
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : value))
  select?: any;
  // load relations
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : value))
  /* @ApiProperty({
    required: false,
    type: Array<string>,
    description: 'Populate attribute',
    example: ['status'],
  }) */
  relations?: Array<string>;
  // conditions
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : value))
  @ApiProperty({
    required: false,
    type: JSON,
    description: 'Search where the "attribute" has the value',
    examples: [
      {
        summary: 'Search',
        value: {},
      },
      {
        summary: 'Search by string',
        description: 'Find the equal value',
        value: { name: 'exactly' },
      },
      {
        summary: 'Search by string contained',
        description: 'Find the value partial contained',
        value: { name: '/exactly/' },
      },
      {
        summary: 'Search by regex',
        description: 'Find using Regular expressions (regex) to refined search',
        value: { name: '/exactly/ig' },
      },
      {
        summary: 'Search by status G - New',
        description: 'Find by status G - New',
        value: { status: 'G - New' },
      },
      {
        summary: 'Search by status Moved',
        description: 'Find by status Moved',
        value: { status: 'Moved' },
      },
      {
        summary: 'Search by status Contacted',
        description: 'Find using Regular expressions (regex) to refined search',
        value: { status: 'contacted' },
      },
      {
        summary: 'Search by status FTD',
        description: 'Find using the name of status',
        value: { status: 'ftd' },
      },
      {
        summary: 'Search by date (ISO8601)',
        description: 'Date must be a Iso8601. Search in createdAt date',
        value: {
          start: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
          end: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(),
        },
      },
      {
        summary: 'Search by status Active date (ISO8601)',
        description: 'Date must be a Iso8601. Search Active status date',
        value: {
          active: {
            start: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            end: new Date(
              new Date().setUTCHours(23, 59, 59, 999),
            ).toISOString(),
          },
        },
      },
      {
        summary: 'Search by status Contacted date (ISO8601)',
        description: 'Date must be a Iso8601. Search Contacted status date',
        value: {
          contacted: {
            start: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            end: new Date(
              new Date().setUTCHours(23, 59, 59, 999),
            ).toISOString(),
          },
        },
      },
      {
        summary: 'Search by status FTD date (ISO8601)',
        description: 'Date must be a Iso8601. Search FTD status date',
        value: {
          ftd: {
            start: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            end: new Date(
              new Date().setUTCHours(23, 59, 59, 999),
            ).toISOString(),
          },
        },
      },
      {
        summary: 'Search by date (ISO8601) - Alias',
        description: 'Date must be a Iso8601. Search CreatedAt date',
        value: {
          from: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
          to: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(),
        },
      },
      {
        summary: 'Search by status active date (ISO8601) - Alias',
        description: 'Date must be a Iso8601. Search Active status date',
        value: {
          active: {
            from: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            to: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(),
          },
        },
      },
      {
        summary: 'Search by status contacted date (ISO8601) - Alias',
        description: 'Date must be a Iso8601. Search Contacted status date',
        value: {
          contacted: {
            from: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            to: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(),
          },
        },
      },
      {
        summary: 'Search by status FTD date (ISO8601) - Alias',
        description: 'Date must be a Iso8601. Search FTD status date',
        value: {
          ftd: {
            from: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            to: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(),
          },
        },
      },
      {
        summary: 'Search by status date combined 1',
        description:
          'Date must be a Iso8601. Search Contacted status with Active status date between start and end',
        value: {
          status: 'contacted',
          active: { start: '2023-03-31', end: '2023-03-31' },
        },
      },
      {
        summary: 'Search by status date combined 2',
        description:
          'Date must be a Iso8601. Search FTD status with Contacted status date between start and end',
        value: {
          status: 'ftd',
          contacted: { start: '2023-03-31', end: '2023-03-31' },
        },
      },
      {
        summary: 'Search by status date combined 1 - Alias',
        description:
          'Date must be a Iso8601. Search Contacted status with Active status date between start and end',
        value: {
          status: 'contacted',
          active: { from: '2023-03-31', to: '2023-03-31' },
        },
      },
      {
        summary: 'Search by status date combined 2 - Alias',
        description:
          'Date must be a Iso8601. Search FTD status with Contacted status date between start and end',
        value: {
          status: 'ftd',
          contacted: { from: '2023-03-31', to: '2023-03-31' },
        },
      },
    ],
  })
  where?: any;
  // order
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : value))
  @ApiProperty({
    required: false,
    type: Array<Array<string>>,
    description: '',
    example: [['name', 'asc']],
  })
  order?: Array<Array<string>>;
  // offset
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : value))
  /* @ApiProperty({
    required: false,
    type: Number,
    description:
      'Number of element to start. This not work if send number of page to',
    example: 2,
  }) */
  start?: number;
  // limit
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : value))
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Number of elements per page',
    example: 10,
  })
  take?: number;
  // pageNumber
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number.parseInt(value) : value))
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Numer of page to load',
    example: 1,
  })
  page?: number;
}
