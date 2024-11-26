import AddressModel from '@common/common/models/AddressModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class AddressSchema implements AddressModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
}
