import { StatusServiceController } from './status-service.controller';
import { StatusServiceService } from './status-service.service';
import { BuildersModule } from '@builder/builders';
import { StatusModule } from '@status/status';
import { Module } from '@nestjs/common';
import { CrmModule } from '@crm/crm';
import { LeadModule } from '@lead/lead';
import { UserModule } from '@user/user';
import { RoleModule } from '@role/role';
import { AffiliateModule } from '@affiliate/affiliate';
import { BusinessUnitModule } from '@business-unit/business-unit';
import { CategoryModule } from '@category/category';
import { PersonModule } from '@person/person';
import { TrafficModule } from '@traffic/traffic';
import { BusinessUnitServiceModule } from 'apps/business-unit-service/src/business-unit-service.module';
import { CategoryServiceModule } from 'apps/category-service/src/category-service.module';
import { PersonServiceModule } from 'apps/person-service/src/person-service.module';
import { RoleServiceModule } from 'apps/role-service/src/role-service.module';
import { StatsServiceModule } from 'apps/stats-service/src/stats-service.module';
import { TrafficServiceModule } from 'apps/traffic-service/src/traffic-service.module';
import { UserServiceModule } from 'apps/user-service/src/user-service.module';

@Module({
  imports: [
    StatusModule,
    BuildersModule,
    CrmModule,
    LeadModule,
    UserModule,
    RoleModule,

    PersonModule,
    TrafficModule,
    CategoryModule,
    AffiliateModule,
    UserServiceModule,
    RoleServiceModule,
    BusinessUnitModule,
    PersonServiceModule,
    StatsServiceModule,
    TrafficServiceModule,
    CategoryServiceModule,
    BusinessUnitServiceModule,
  ],
  controllers: [StatusServiceController],
  providers: [StatusServiceService],
})
export class StatusServiceModule {}
