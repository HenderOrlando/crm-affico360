import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { QueueAdminService } from '@common/common/queue-admin-providers/queue.admin.provider.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function bootstrapMicroservice(module, env: EnvironmentEnum) {
  const app = await NestFactory.create(module, {
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
  const queueAdminService = app.get<QueueAdminService>(QueueAdminService);
  app.connectMicroservice(queueAdminService.getOptions(env));
  await app.startAllMicroservices();
  if (typeof process.send === 'function') {
    process.send('ready');
  }
}
