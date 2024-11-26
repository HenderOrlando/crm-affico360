import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { StatusCreateDto } from '@status/status/dto/status.create.dto';
import { StatusUpdateDto } from '@status/status/dto/status.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import axios from 'axios';
import { CommonService } from '@common/common';

@Injectable()
export class StatusServiceMongooseService extends BasicServiceModel<
  StatusDocument,
  Model<StatusDocument>,
  StatusCreateDto,
  StatusUpdateDto
> {
  constructor(
    @Inject('STATUS_MODEL_MONGOOSE') private statusModel: Model<StatusDocument>,
  ) {
    super(statusModel);
  }
}
