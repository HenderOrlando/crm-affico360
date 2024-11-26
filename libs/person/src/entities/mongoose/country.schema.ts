import CountryModel from '@common/common/models/CountryModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class CountrySchema implements CountryModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
}
