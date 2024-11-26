import { GroupServiceController } from './group-service.controller';
import { GroupServiceService } from './group-service.service';
import { BuildersModule } from '@builder/builders';
import { GroupModule } from '@group/group';
import { Module } from '@nestjs/common';

@Module({
  imports: [GroupModule, BuildersModule],
  controllers: [GroupServiceController],
  providers: [GroupServiceService],
})
export class GroupServiceModule {}
