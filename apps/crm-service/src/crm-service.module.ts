import { CrmServiceController } from './crm-service.controller';
import { IntegrationModule } from '@integration/integration';
import { CrmServiceService } from './crm-service.service';
import { BuildersModule } from '@builder/builders';
import { CrmModule } from '@crm/crm';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CrmModule,
    BuildersModule,
    IntegrationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [CrmServiceController],
  providers: [CrmServiceService],
})
export class CrmServiceModule {}
