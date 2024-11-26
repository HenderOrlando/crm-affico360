import { BuildersModule } from '@builder/builders';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Module } from '@nestjs/common';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import { QueueAdminModule } from '@common/common/queue-admin-providers/queue.admin.provider.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [JobController],
  imports: [
    BuildersModule,
    ScheduleModule.forRoot(),
    QueueAdminModule.register({ name: `${EventClientEnum.TRANSFER}-CLIENT` }),
  ],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
