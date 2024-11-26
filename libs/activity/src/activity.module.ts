import { ActivityServiceMongooseService } from '@activity/activity/activity-service-mongoose.service';
import { activityProviders } from './providers/activity.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [ActivityServiceMongooseService, ...activityProviders],
  exports: [ActivityServiceMongooseService, ...activityProviders],
})
export class ActivityModule {}
