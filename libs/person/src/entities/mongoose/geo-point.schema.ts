import GeopointModel from '@common/common/models/GeopointModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class GeoPointSchema implements GeopointModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;
}
