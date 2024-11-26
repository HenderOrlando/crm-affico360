import StreetModel from '@common/common/models/StreetModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class StreetSchema implements StreetModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
}
