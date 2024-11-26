import BirthModel from '@common/common/models/BirthModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BirthSchema implements BirthModel {
  @Prop()
  birthDate: Date;

  @Prop()
  birthCountry: string;
}
