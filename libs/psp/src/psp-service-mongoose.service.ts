import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { PspCreateDto } from '@psp/psp/dto/psp.create.dto';
import { PspUpdateDto } from '@psp/psp/dto/psp.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PspServiceMongooseService extends BasicServiceModel<
  PspDocument,
  Model<PspDocument>,
  PspCreateDto,
  PspUpdateDto
> {
  constructor(@Inject('PSP_MODEL_MONGOOSE') pspModel: Model<PspDocument>) {
    super(pspModel);
  }
}
