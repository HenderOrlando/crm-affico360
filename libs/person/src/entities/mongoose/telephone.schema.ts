import { Category } from '@category/category/entities/mongoose/category.schema';
import TelephoneModel from '@common/common/models/TelephoneModel';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class TelephoneSchema implements TelephoneModel {
  @Prop()
  phoneName: string;

  @Prop()
  countryName: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;
}
