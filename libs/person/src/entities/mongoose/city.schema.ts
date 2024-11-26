import CityModel from '@common/common/models/CityModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class CitySchema implements CityModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
}
