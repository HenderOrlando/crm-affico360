import { GeoPointSchema } from '@person/person/entities/mongoose/geo-point.schema';
import { ZipCodeSchema } from '@person/person/entities/mongoose/zip-code.schema';
import { AddressSchema } from '@person/person/entities/mongoose/address.schema';
import { Category } from '@category/category/entities/mongoose/category.schema';
import { StreetSchema } from '@person/person/entities/mongoose/street.schema';
import { ColonySchema } from '@person/person/entities/mongoose/colony.schema';
import { CitySchema } from '@person/person/entities/mongoose/city.schema';
import LocationModel from '@common/common/models/LocationModel';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';

@Schema()
export class LocationSchema implements LocationModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop({ type: ColonySchema })
  colony: ColonySchema;

  @Prop({ type: CitySchema })
  city: CitySchema;

  @Prop({ type: String, enum: CountryCodeAfficoEnum })
  country: CountryCodeAfficoEnum;

  @Prop({ type: AddressSchema })
  address: AddressSchema;

  @Prop({ type: StreetSchema })
  street: StreetSchema;

  @Prop({ type: ZipCodeSchema })
  zipcode: ZipCodeSchema;

  @Prop({ type: GeoPointSchema })
  geopoint: GeoPointSchema;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;
}
