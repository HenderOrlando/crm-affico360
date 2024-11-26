import { BusinessUnitServiceService } from 'apps/business-unit-service/src/business-unit-service.service';
import { BusinessUnitServiceModule } from 'apps/business-unit-service/src/business-unit-service.module';
import { AffiliateServiceService } from 'apps/affiliate-service/src/affiliate-service.service';
import { CategoryServiceService } from 'apps/category-service/src/category-service.service';
import { CategoryServiceModule } from 'apps/category-service/src/category-service.module';
import { PersonServiceService } from 'apps/person-service/src/person-service.service';
import { StatusServiceService } from 'apps/status-service/src/status-service.service';
import { PersonServiceModule } from 'apps/person-service/src/person-service.module';
import { StatusServiceModule } from 'apps/status-service/src/status-service.module';
import { UserServiceService } from 'apps/user-service/src/user-service.service';
import { RoleServiceService } from 'apps/role-service/src/role-service.service';
import { UserServiceModule } from 'apps/user-service/src/user-service.module';
import { RoleServiceModule } from 'apps/role-service/src/role-service.module';
import { CrmServiceModule } from 'apps/crm-service/src/crm-service.module';
import { LeadServiceController } from './lead-service.controller';
import { BusinessUnitModule } from '@business-unit/business-unit';
import { LeadServiceService } from './lead-service.service';
import { AffiliateModule } from '@affiliate/affiliate';
import { CategoryModule } from '@category/category';
import { BuildersModule } from '@builder/builders';
import { PersonModule } from '@person/person';
import { StatusModule } from '@status/status';
import { LeadModule } from '@lead/lead';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user';
import { RoleModule } from '@role/role';
import { CrmModule } from '@crm/crm';
import { TrafficServiceService } from 'apps/traffic-service/src/traffic-service.service';
import { TrafficModule } from '@traffic/traffic';
import { TrafficServiceModule } from 'apps/traffic-service/src/traffic-service.module';
import { QueueAdminModule } from '@common/common/queue-admin-providers/queue.admin.provider.module';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import { LeadServiceWebsocketGateway } from './lead-service.websocket.gateway';
import { FileModule } from '@file/file';
import { FileServiceService } from 'apps/file-service/src/file-service.service';

@Module({
  imports: [
    CrmModule,
    LeadModule,
    UserModule,
    RoleModule,
    FileModule,
    PersonModule,
    StatusModule,
    TrafficModule,
    CategoryModule,
    BuildersModule,
    AffiliateModule,
    UserServiceModule,
    RoleServiceModule,
    BusinessUnitModule,
    PersonServiceModule,
    StatusServiceModule,
    TrafficServiceModule,
    CategoryServiceModule,
    BusinessUnitServiceModule,
    QueueAdminModule.register({ name: `${EventClientEnum.LEAD}-CLIENT` }),
  ],
  providers: [
    FileServiceService,
    LeadServiceService,
    UserServiceService,
    RoleServiceService,
    PersonServiceService,
    StatusServiceService,
    TrafficServiceService,
    AffiliateServiceService,
    CategoryServiceService,
    BusinessUnitServiceService,
    LeadServiceWebsocketGateway,
  ],
  controllers: [LeadServiceController],
})
export class LeadServiceModule {}
