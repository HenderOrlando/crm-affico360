import { PersonServiceModule } from './person-service.module';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(PersonServiceModule);
  app.enableCors();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
