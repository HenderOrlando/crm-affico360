import { BuildersModule } from '@builder/builders';
import { CommonModule } from '@common/common/common.module';
import { QueueAdminModule } from '@common/common/queue-admin-providers/queue.admin.provider.module';
import configuration from '@config/config';
import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResponseAfficoModule } from '@response-affico/response-affico';

export const moduleImportsConfig = [
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
  BuildersModule,
  QueueAdminModule,
];
