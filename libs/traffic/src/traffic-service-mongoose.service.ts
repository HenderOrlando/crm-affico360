import { TrafficDocument } from '@traffic/traffic/entities/mongoose/traffic.schema';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { TrafficCreateDto } from '@traffic/traffic/dto/traffic.create.dto';
import { TrafficUpdateDto } from '@traffic/traffic/dto/traffic.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TrafficServiceMongooseService extends BasicServiceModel<
  TrafficDocument,
  Model<TrafficDocument>,
  TrafficCreateDto,
  TrafficUpdateDto
> {
  constructor(
    @Inject('TRAFFIC_MODEL_MONGOOSE')
    trafficModel: Model<TrafficDocument>,
  ) {
    super(trafficModel);
  }
}
