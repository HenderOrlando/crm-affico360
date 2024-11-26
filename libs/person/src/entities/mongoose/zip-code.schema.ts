import ZipCodeModel from '@common/common/models/ZipCodeModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ZipCodeSchema implements ZipCodeModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
}
