import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { GroupDocument } from '@group/group/entities/mongoose/group.schema';
import { GroupCreateDto } from '@group/group/dto/group.create.dto';
import { GroupUpdateDto } from '@group/group/dto/group.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class GroupServiceMongooseService extends BasicServiceModel<
  GroupDocument,
  Model<GroupDocument>,
  GroupCreateDto,
  GroupUpdateDto
> {
  constructor(
    @Inject('GROUP_MODEL_MONGOOSE') groupModel: Model<GroupDocument>,
  ) {
    super(groupModel);
  }
}
