import { ActivityDocument } from '@activity/activity/entities/mongoose/activity.schema';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { ActivityCreateDto } from '@activity/activity/dto/activity.create.dto';
import { ActivityUpdateDto } from '@activity/activity/dto/activity.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ActivityServiceMongooseService extends BasicServiceModel<
  ActivityDocument,
  Model<ActivityDocument>,
  ActivityCreateDto,
  ActivityUpdateDto
> {
  constructor(
    @Inject('ACTIVITY_MODEL_MONGOOSE')
    activityModel: Model<ActivityDocument>,
  ) {
    super(activityModel);
  }
}
