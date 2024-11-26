import { AuthModule } from '@auth/auth';
import { BuildersModule } from '@builder/builders';
import { ResponseHttpExceptionFilter } from '@common/common/exceptions/response.exception';
import { ResponseInterceptor } from '@common/common/interceptors/response.interceptor';
import { IProvider } from '@common/common/interfaces/i.provider.interface';
import { QueueAdminModule } from '@common/common/queue-admin-providers/queue.admin.provider.module';
import { CacheInterceptor, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { ActivityServiceModule } from 'apps/activity-service/src/activity-service.module';
import { AffiliateServiceModule } from 'apps/affiliate-service/src/affiliate-service.module';
import { BusinessUnitServiceModule } from 'apps/business-unit-service/src/business-unit-service.module';
import { CategoryServiceModule } from 'apps/category-service/src/category-service.module';
import { CommunicationServiceModule } from 'apps/communication-service/src/communication-service.module';
import { CrmServiceModule } from 'apps/crm-service/src/crm-service.module';
import { FileServiceModule } from 'apps/file-service/src/file-service.module';
import { GroupServiceModule } from 'apps/group-service/src/group-service.module';
import { IpAddressServiceModule } from 'apps/ip-address-service/src/ip-address-service.module';
import { LeadServiceModule } from 'apps/lead-service/src/lead-service.module';
import { MessageServiceModule } from 'apps/message-service/src/message-service.module';
import { PermissionServiceModule } from 'apps/permission-service/src/permission-service.module';
import { PersonServiceModule } from 'apps/person-service/src/person-service.module';
import { PspServiceModule } from 'apps/psp-service/src/psp-service.module';
import { RoleServiceModule } from 'apps/role-service/src/role-service.module';
import { SecurityServiceModule } from 'apps/security-service/src/security-service.module';
import { StatsServiceModule } from 'apps/stats-service/src/stats-service.module';
import { StatusServiceModule } from 'apps/status-service/src/status-service.module';
import { TrafficServiceModule } from 'apps/traffic-service/src/traffic-service.module';
import { TransferServiceModule } from 'apps/transfer-service/src/transfer-service.module';
import { UserServiceModule } from 'apps/user-service/src/user-service.module';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

export const configApp = {
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      max: 5,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BuildersModule,
    ResponseAfficoModule,
    // Services Privated
    UserServiceModule,
    StatusServiceModule,
    RoleServiceModule,
    PersonServiceModule,
    PspServiceModule,
    PermissionServiceModule,
    MessageServiceModule,
    LeadServiceModule,
    IpAddressServiceModule,
    GroupServiceModule,
    FileServiceModule,
    CrmServiceModule,
    CategoryServiceModule,
    BusinessUnitServiceModule,
    AffiliateServiceModule,
    ActivityServiceModule,
    TrafficServiceModule,
    TransferServiceModule,
    AuthModule,
    // Servicies Public
    CommunicationServiceModule,
    SecurityServiceModule,
    StatsServiceModule,
    QueueAdminModule,
    //SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ResponseHttpExceptionFilter,
    },
  ] as IProvider[],
  exports: [],
};
