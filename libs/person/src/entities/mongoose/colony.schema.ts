import ColonyModel from '@common/common/models/ColonyModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ColonySchema implements ColonyModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;
}
