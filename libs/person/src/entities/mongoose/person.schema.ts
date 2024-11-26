import { Affiliate } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import DocIdTypeEnum from '@common/common/enums/DocIdTypeEnum';
import GenderEnum from '@common/common/enums/GenderEnum';
import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BirthSchema } from '@person/person/entities/mongoose/birth.schema';
import { JobSchema } from '@person/person/entities/mongoose/job.schema';
import { KyCSchema } from '@person/person/entities/mongoose/kyc.schema';
import { LocationSchema } from '@person/person/entities/mongoose/location.schema';
import { TelephoneSchema } from '@person/person/entities/mongoose/telephone.schema';
import { PersonEntity } from '@person/person/entities/person.entity';
import { Traffic } from '@traffic/traffic/entities/mongoose/traffic.schema';
import { User } from '@user/user/entities/mongoose/user.schema';
import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type PersonDocument = Person & Document;

@Schema({
  timestamps: true,
})
export class Person extends PersonEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string[];

  @Prop([{ type: TelephoneSchema }])
  telephone: TelephoneSchema[];

  @Prop()
  numDocId: string;

  @Prop({ type: String, enum: DocIdTypeEnum })
  typeDocId: DocIdTypeEnum;

  @Prop({ type: LocationSchema })
  location: LocationSchema;

  @Prop({ type: JobSchema })
  job: JobSchema;

  @Prop({ type: BirthSchema })
  birth: BirthSchema;

  @Prop({ type: String, enum: GenderEnum })
  gender: GenderEnum;

  @Prop({ type: KyCSchema })
  kyc: KyCSchema;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'leads' }] })
  leads: Lead[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'traffics' }] })
  traffics: Traffic[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'affiliates' }] })
  affiliates: Affiliate[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);
