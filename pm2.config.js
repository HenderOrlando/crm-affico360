module.exports = {
  apps: [
    {
      name: 'affico2-microservices',
      script: './dist-pm2/apps/affico2/main-microservices.js',
      watch: ['./dist-pm2/apps/affico2/main-microservices.js'],
      exp_backoff_restart_delay: 100,
      instances: 'max',
      exec_mode: 'cluster',
      //wait_ready: true,
      env: {
        ENVIRONMENT: 'DEV',
        APP_NAME: 'Affico360',
        GOOGLE_2FA: true,
        DATABASE_NAME: 'affico2',
        //DATABASE_URL: 'mongodb://localhost:27017/affico2',
        DATABASE_URL:
          'mongodb+srv://dev-affico:KE2u5f7MqGiSaJ@affico2-dev.jhy4t57.mongodb.net/affico2',
        PORT: 3000,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST: 'localhost',
        RABBIT_MQ_PORT: 5672,
        RABBIT_MQ_QUEUE: 'DEV',
        RABBIT_MQ_USERNAME: 'admin',
        RABBIT_MQ_PASSWORD: 'admin',
        DATABASE_REDIS_HOST: 'localhost',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'affico360',
        DATABASE_REDIS_PORT: 6379,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: true,
        TZ: 'America/Mexico_City',
        //TZ: 'UTC',
      },
      env_prod: {
        ENVIRONMENT: 'PROD',
        APP_NAME: 'Affico360',
        GOOGLE_2FA: true,
        DATABASE_URL:
          'mongodb+srv://affico360:Y4YVhXqSp9ytPYnd@affico360-prod.qxxbw.mongodb.net/affico2',
        PORT: 8080,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST:
          'b-f14ee982-03d3-4b15-8893-9af5b86ed644.mq.us-west-1.amazonaws.com',
        RABBIT_MQ_PORT: 5671,
        RABBIT_MQ_QUEUE: 'PROD',
        RABBIT_MQ_USERNAME: 'affico360',
        RABBIT_MQ_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_HOST:
          'redis-12145.c60.us-west-1-2.ec2.cloud.redislabs.com',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_PORT: 12145,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: false,
        TZ: 'America/Mexico_City',
        //TZ: 'UTC',
      },
      env_stage: {
        ENVIRONMENT: 'STAGE',
        APP_NAME: 'Affico360',
        GOOGLE_2FA: true,
        DATABASE_URL:
          'mongodb+srv://stage-affico360:OO4X6pItuexC4M5g@affico360.bn4iito.mongodb.net/affico2?retryWrites=true&w=majority',
        PORT: 8080,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST:
          'b-f14ee982-03d3-4b15-8893-9af5b86ed644.mq.us-west-1.amazonaws.com',
        RABBIT_MQ_PORT: 5671,
        RABBIT_MQ_QUEUE: 'STAGE',
        RABBIT_MQ_USERNAME: 'affico360',
        RABBIT_MQ_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_HOST:
          'redis-12145.c60.us-west-1-2.ec2.cloud.redislabs.com',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_PORT: 12145,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: false,
        TZ: 'America/Mexico_City',
      },
      env_fake: {
        ENVIRONMENT: 'FAKE',
        APP_NAME: 'Coaffico',
        GOOGLE_2FA: false,
        DATABASE_NAME: 'coaffico',
        DATABASE_URL:
          //'mongodb+srv://stage-affico360:OO4X6pItuexC4M5g@affico360.bn4iito.mongodb.net/affico2?retryWrites=true&w=majority',
          'mongodb+srv://affico360:Y4YVhXqSp9ytPYnd@affico360-prod.qxxbw.mongodb.net/coaffico',
        PORT: 8080,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST:
          'b-d58d63b2-2447-4cc7-8830-973da93cee7b.mq.us-west-1.amazonaws.com',
        RABBIT_MQ_PORT: 5671,
        RABBIT_MQ_QUEUE: 'FAKE',
        RABBIT_MQ_USERNAME: 'affico360',
        RABBIT_MQ_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_HOST:
          'redis-12145.c60.us-west-1-2.ec2.cloud.redislabs.com',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_PORT: 12145,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: false,
        TZ: 'America/Mexico_City',
        //TZ: 'UTC',
      },
    },
    {
      name: 'affico2-gateway',
      script: './dist-pm2/apps/affico2/main-gateway.js',
      watch: ['./dist-pm2/apps/affico2/main-gateway.js'],
      exp_backoff_restart_delay: 100,
      instances: '1',
      exec_mode: 'cluster',
      //wait_ready: true,
      env: {
        ENVIRONMENT: 'DEV',
        APP_NAME: 'Affico360',
        GOOGLE_2FA: true,
        DATABASE_NAME: 'affico2',
        //DATABASE_URL: 'mongodb://localhost:27017/affico2',
        DATABASE_URL:
          'mongodb+srv://dev-affico:KE2u5f7MqGiSaJ@affico2-dev.jhy4t57.mongodb.net/affico2',
        PORT: 3000,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST: 'localhost',
        RABBIT_MQ_PORT: 5672,
        RABBIT_MQ_QUEUE: 'DEV',
        RABBIT_MQ_USERNAME: 'admin',
        RABBIT_MQ_PASSWORD: 'admin',
        DATABASE_REDIS_HOST: 'localhost',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'affico360',
        DATABASE_REDIS_PORT: 6379,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: true,
        TZ: 'America/Mexico_City',
        //TZ: 'UTC',
      },
      env_prod: {
        ENVIRONMENT: 'PROD',
        APP_NAME: 'Affico360',
        GOOGLE_2FA: true,
        DATABASE_URL:
          'mongodb+srv://affico360:Y4YVhXqSp9ytPYnd@affico360-prod.qxxbw.mongodb.net/affico2',
        PORT: 8080,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST:
          'b-f14ee982-03d3-4b15-8893-9af5b86ed644.mq.us-west-1.amazonaws.com',
        RABBIT_MQ_PORT: 5671,
        RABBIT_MQ_QUEUE: 'PROD',
        RABBIT_MQ_USERNAME: 'affico360',
        RABBIT_MQ_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_HOST:
          'redis-12145.c60.us-west-1-2.ec2.cloud.redislabs.com',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_PORT: 12145,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: false,
        TZ: 'America/Mexico_City',
        //TZ: 'UTC',
      },
      env_stage: {
        ENVIRONMENT: 'STAGE',
        APP_NAME: 'Affico360',
        GOOGLE_2FA: true,
        DATABASE_URL:
          'mongodb+srv://stage-affico360:OO4X6pItuexC4M5g@affico360.bn4iito.mongodb.net/affico2?retryWrites=true&w=majority',
        PORT: 8080,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST:
          'b-f14ee982-03d3-4b15-8893-9af5b86ed644.mq.us-west-1.amazonaws.com',
        RABBIT_MQ_PORT: 5671,
        RABBIT_MQ_QUEUE: 'STAGE',
        RABBIT_MQ_USERNAME: 'affico360',
        RABBIT_MQ_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_HOST:
          'redis-12145.c60.us-west-1-2.ec2.cloud.redislabs.com',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_PORT: 12145,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: false,
        TZ: 'America/Mexico_City',
      },
      env_fake: {
        ENVIRONMENT: 'FAKE',
        GOOGLE_2FA: false,
        APP_NAME: 'Coaffico',
        DATABASE_NAME: 'coaffico',
        DATABASE_URL:
          //'mongodb+srv://stage-affico360:OO4X6pItuexC4M5g@affico360.bn4iito.mongodb.net/affico2?retryWrites=true&w=majority',
          //'mongodb+srv://dev-affico:KE2u5f7MqGiSaJ@affico2-dev.jhy4t57.mongodb.net/affico2',
          'mongodb+srv://affico360:Y4YVhXqSp9ytPYnd@affico360-prod.qxxbw.mongodb.net/coaffico',
        PORT: 8080,
        AUTH_EXPIRE_IN: '8h',
        AUTH_SECRET: 'AFFICO 2',
        AUTH_MAX_SECONDS_TO_REFRESH: '60',
        RABBIT_MQ_HOST:
          'b-d58d63b2-2447-4cc7-8830-973da93cee7b.mq.us-west-1.amazonaws.com',
        RABBIT_MQ_PORT: 5671,
        RABBIT_MQ_QUEUE: 'FAKE',
        RABBIT_MQ_USERNAME: 'affico360',
        RABBIT_MQ_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_HOST:
          'redis-12145.c60.us-west-1-2.ec2.cloud.redislabs.com',
        DATABASE_REDIS_USERNAME: 'affico360',
        DATABASE_REDIS_PASSWORD: 'Dd0kY1ypYIZMFxuyTRC1tmtpx9Nu4Ftr-',
        DATABASE_REDIS_PORT: 12145,
        API_KEY_EMAIL_APP:
          '$2b$10$ZNgsKw805EVNazrz3uoCHugiLladqTAEpL8vjwPTPPnF3tvTXiJAK',
        URL_API_EMAIL_APP: 'https://api.mailkeeperdoc.com/api/v1/email/affico',
        TESTING: false,
        TZ: 'America/Mexico_City',
        //TZ: 'UTC',
      },
    },
  ],
};
