import { AffiliateModule } from '@affiliate/affiliate';
import { BuildersModule } from '@builder/builders';
import { BusinessUnitModule } from '@business-unit/business-unit';
import { CrmModule } from '@crm/crm';
import { Module } from '@nestjs/common';
import { StatsModule } from '@stats/stats';
import { StatsServiceController } from './stats-service.controller';
import { StatsServiceService } from './stats-service.service';
import { QueueAdminModule } from '@common/common/queue-admin-providers/queue.admin.provider.module';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import { StatsPspAccountServiceWebsocketGateway } from './stats-psp-account-service.websocket.gateway';
import { StatsAffiliateServiceWebsocketGateway } from './stats-affiliate-service.websocket.gateway';
import { StatsPspAccountServiceService } from './stats-psp-account-service.service';
import { StatsAffiliateServiceService } from './stats-affiliate-service.service';
import { FileModule } from '@file/file';
import { FileServiceService } from 'apps/file-service/src/file-service.service';
import { StatsAllService } from './stats-all.service';

@Module({
  imports: [
    CrmModule,
    FileModule,
    AffiliateModule,
    BusinessUnitModule,
    StatsModule,
    BuildersModule,
    QueueAdminModule.register({ name: `${EventClientEnum.LEAD}-CLIENT` }),
    QueueAdminModule.register({ name: `${EventClientEnum.TRANSFER}-CLIENT` }),
  ],
  controllers: [StatsServiceController],
  providers: [
    StatsAllService,
    FileServiceService,
    StatsServiceService,
    StatsAffiliateServiceService,
    StatsPspAccountServiceService,
    StatsAffiliateServiceWebsocketGateway,
    StatsPspAccountServiceWebsocketGateway,
  ],
})
export class StatsServiceModule {}
