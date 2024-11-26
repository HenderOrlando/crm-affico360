import { GroupServiceMongooseService } from '@group/group/group-service-mongoose.service';
import { groupProviders } from './providers/group.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [GroupServiceMongooseService, ...groupProviders],
  exports: [GroupServiceMongooseService, ...groupProviders],
})
export class GroupModule {}
