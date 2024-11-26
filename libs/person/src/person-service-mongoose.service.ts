import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { PersonDocument } from './entities/mongoose/person.schema';
import { PersonCreateDto } from './dto/person.create.dto';
import { PersonUpdateDto } from './dto/person.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PersonServiceMongooseService extends BasicServiceModel<
  PersonDocument,
  Model<PersonDocument>,
  PersonCreateDto,
  PersonUpdateDto
> {
  constructor(
    @Inject('PERSON_MODEL_MONGOOSE') personModel: Model<PersonDocument>,
  ) {
    super(personModel);
  }
}
