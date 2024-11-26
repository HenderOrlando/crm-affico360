import { StatusServiceMongooseService } from '@status/status/status-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { statusProviders } from './providers/status.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [StatusServiceMongooseService, ...statusProviders],
  exports: [StatusServiceMongooseService, ...statusProviders],
})
export class StatusModule {}
