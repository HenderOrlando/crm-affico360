import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { databaseProviders } from './database-providers/database-providers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  providers: [CommonService, ...databaseProviders],
  exports: [CommonService, ...databaseProviders],
})
export class CommonModule {}
