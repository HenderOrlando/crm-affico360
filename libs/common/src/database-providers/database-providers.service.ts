import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const databaseProviders = [
  {
    provide: 'MONGOOSE_CONNECTION',
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      const dbName = configService.get('DATABASE_NAME');
      const dbUrl = configService.get('DATABASE_URL');
      Logger.log(dbUrl, 'Database URL Connection');
      return mongoose
        .connect(dbUrl, {
          w: 'majority',
          retryWrites: true,
          dbName: dbName,
          keepAlive: true,
          keepAliveInitialDelay: 300000,
        })
        .catch((reason) => {
          return reason;
        });
    },
    imports: [ConfigModule],
    inject: [ConfigService],
  },
];
