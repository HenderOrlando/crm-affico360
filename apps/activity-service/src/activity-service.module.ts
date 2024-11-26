import { ActivityModule } from '@activity/activity';
import { BuildersModule } from '@builder/builders';
import { ResponseHttpExceptionFilter } from '@common/common/exceptions/response.exception';
import { ResponseInterceptor } from '@common/common/interceptors/response.interceptor';
import { IProvider } from '@common/common/interfaces/i.provider.interface';
import configuration from '@config/config';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { ActivityServiceController } from './activity-service.controller';
import { ActivityServiceService } from './activity-service.service';
import { ActivityServiceWebsocketGateway } from './activity-service.websocket.gateway';
import { CommonModule } from '@common/common';
import { QueueAdminModule } from '@common/common/queue-admin-providers/queue.admin.provider.module';

@Module({
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
    CommonModule,
    BuildersModule,
    ResponseAfficoModule,
    ActivityModule,
    BuildersModule,
    QueueAdminModule,
  ],
  controllers: [ActivityServiceController],
  providers: [
    ActivityServiceService,
    ActivityServiceWebsocketGateway,
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
})
export class ActivityServiceModule {}
