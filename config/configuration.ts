import { CommonService } from '@common/common';
import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  AUTH_APP_NAME: process.env.AUTH_APP_NAME || 'MOISES',
  APP_NAME: process.env.APP_NAME || 'Affico360',
  GOOGLE_2FA:
    process.env.GOOGLE_2FA === 'true'
      ? true
      : process.env.GOOGLE_2FA === 'false'
      ? false
      : true,
  MAX_SECOND_TO_REFRESH: process.env.MAX_SECOND_TO_REFRESH || 60,
  ENVIRONMENT: CommonService.getSlug(
    process.env.ENVIRONMENT || EnvironmentEnum.prod,
  ),
  AUTH_SECRET:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.AUTH_SECRET
      : 'AFFICO 2',
  AUTH_EXPIRE_IN:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.AUTH_EXPIRE_IN || '60m'
      : '8h',
  AUTH_MAX_SECONDS_TO_REFRESH:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.AUTH_MAX_SECONDS_TO_REFRESH || '60'
      : '60',
  PORT:
    process.env.ENVIRONMENT == EnvironmentEnum.prod ? process.env.PORT : 3000,
  DATABASE_NAME:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.DATABASE_NAME
      : 'affico2',
  DATABASE_URL:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.DATABASE_URL
      : 'mongodb://localhost:27017/affico2',
  DATABASE_REDIS_HOST:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.DATABASE_REDIS_HOST
      : 'localhost',
  DATABASE_REDIS_USERNAME:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.DATABASE_REDIS_USERNAME
      : 'affico360',
  DATABASE_REDIS_PASSWORD:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.DATABASE_REDIS_PASSWORD
      : null,
  DATABASE_REDIS_PORT:
    process.env.ENVIRONMENT == EnvironmentEnum.prod
      ? process.env.DATABASE_REDIS_PORT
      : 6379,
  RABBIT_MQ_HOST: process.env.RABBIT_MQ_HOST ?? 'localhost',
  RABBIT_MQ_PORT: process.env.RABBIT_MQ_PORT ?? '5672',
  RABBIT_MQ_QUEUE: process.env.RABBIT_MQ_QUEUE ?? 'DEV',
  RABBIT_MQ_USERNAME: process.env.RABBIT_MQ_USERNAME ?? 'admin',
  RABBIT_MQ_PASSWORD: process.env.RABBIT_MQ_PASSWORD ?? 'admin',
  TESTING: process.env.TESTING ?? true,
  TZ: process.env.TZ,
}));
