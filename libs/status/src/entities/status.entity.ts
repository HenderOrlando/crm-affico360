import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { ApiProperty } from '@nestjs/swagger';
import { StatusInterface } from '@status/status/entities/status.interface';
import { ObjectId } from 'mongodb';

export class StatusEntity implements StatusInterface {
  id: ObjectId;
  _id: string;
  @ApiProperty({
    type: String,
    description: 'Name of the status',
  })
  name: string;
  idCashier: string;
  slug: string;
  @ApiProperty({
    type: String,
    description: 'Description of the status',
  })
  description: string;
  searchText: string;
  active: boolean;
  resources: ResourcesEnum[];
  createdAt: Date;
  updatedAt: Date;
}
