import { TrafficServiceMongooseService } from '@traffic/traffic/traffic-service-mongoose.service';
import { trafficProviders } from './providers/traffic.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [TrafficServiceMongooseService, ...trafficProviders],
  exports: [TrafficServiceMongooseService, ...trafficProviders],
})
export class TrafficModule {}
