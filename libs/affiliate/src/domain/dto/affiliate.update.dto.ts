import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AffiliateCreateDto } from './affiliate.create.dto';
import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AffiliateUpdateDto extends PartialType(AffiliateCreateDto) {
  @ApiProperty({
    description: 'Affiliate id',
  })
  @IsMongoId()
  id: ObjectId;
}
