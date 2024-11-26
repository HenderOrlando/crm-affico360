import JobModel from '@common/common/models/JobModel';
import { Prop, Schema } from '@nestjs/mongoose';
import { LocationSchema } from '@person/person/entities/mongoose/location.schema';

@Schema()
export class JobSchema implements JobModel {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop()
  company: string;

  @Prop({ type: LocationSchema })
  location: LocationSchema;

  @Prop()
  activity: string;

  @Prop()
  salary: number;
}
