import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConnectionEnum from '@common/common/enums/DatabaseConnectionEnum';

export const databaseProviders = [
  {
    provide: `MONGOOSE_CONNECTION${DatabaseConnectionEnum.Activity}`,
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      const dbName = configService.get('DATABASE_NAME');
      const dbUrl = configService.get('DATABASE_URL');
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
