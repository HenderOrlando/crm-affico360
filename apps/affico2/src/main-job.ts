import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppJobModule } from './app.job.module';

async function bootstrap(port?: number | string) {
  Logger.log(process.env.TZ, 'Timezone Gateway');
  port = port ?? process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppJobModule, {
    cors: true,
  });

  const validationPipes = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  app.useGlobalPipes(validationPipes);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders:
      'affico-360-affiliate-key affico-360-key Content-Type Accept,Authorization',
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(port);
  if (typeof process.send === 'function') {
    process.send('ready');
  }
}

bootstrap();
