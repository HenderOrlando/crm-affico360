import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  OpenAPIObject,
  PathsObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { isNumber } from 'class-validator';
import * as http from 'http';

export async function bootstrapGateway(
  module,
  env: EnvironmentEnum,
  port = 3000,
  swaggerConfig?: Array<DocumentSwaggerConfig>,
) {
  port = await getNextOpenPort(port);
  if (!isNumber(port)) {
    return false;
  }
  Logger.log(port, 'Deploy port');
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
  if (swaggerConfig) {
    swaggerConfig.forEach((swc) => {
      swc.app = app;
      addSwagger(swc);
    });
  }

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

export interface DocumentSwaggerConfig {
  app: INestApplication;
  uri: string;
  title: string;
  description: string;
  version: string;
  tags: Array<string>;
  modules: Array<any>;
  basicAuth: BasicAuthSwaggerInterface;
}

export class BasicAuthSwaggerInterface {
  challenge = true;
  users: JSON;
}

function addSwagger(documentConfig: DocumentSwaggerConfig) {
  const config = new DocumentBuilder()
    .setTitle(documentConfig.title)
    .setDescription(documentConfig.description)
    .setVersion(documentConfig.version);
  documentConfig.tags.forEach((tagName) => {
    config.addTag(tagName);
  });
  const document = SwaggerModule.createDocument(
    documentConfig.app,
    config.build(),
    {
      include: documentConfig.modules,
    },
  );

  document.paths = filterDocumentsPathsByTags(document);
  SwaggerModule.setup(documentConfig.uri, documentConfig.app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}

async function isPortOpen(port) {
  return new Promise((resolve, reject) => {
    try {
      const s = http.createServer();
      s.once('error', (err) => {
        s.close();
        resolve(err['code'] == 'EADDRINUSE');
      });
      s.once('listening', () => {
        s.close();
        resolve(true);
      });
      s.listen(port);
    } catch (err) {
      reject(err);
    }
  });
}

async function getNextOpenPort(startFrom = 3000): Promise<number> {
  let openPort = null;
  try {
    while (startFrom < 65535 || !!openPort) {
      if (await isPortOpen(startFrom)) {
        openPort = startFrom;
        break;
      }
      startFrom++;
    }
    return openPort;
  } catch (err) {
    console.error(err);
  }
}

const arrayIntersect = (array1: string[], array2: string[]): string[] =>
  array1.filter((item) => array2.includes(item));

const filterDocumentsPathsByTags = (
  publicDocument: OpenAPIObject,
): PathsObject => {
  const result: PathsObject = {};

  const tags = publicDocument.tags.map(({ name }) => name);

  for (const path of Object.keys(publicDocument.paths)) {
    const pathMethods = {};

    for (const method of Object.keys(publicDocument.paths[path])) {
      const endpointTags = publicDocument.paths[path][method].tags;

      if (!Array.isArray(endpointTags)) {
        continue;
      }
      const intersect = arrayIntersect(tags, endpointTags);
      if (intersect.length > 0) {
        publicDocument.paths[path][method].tags = intersect;
        pathMethods[method] = publicDocument.paths[path][method];
      }
    }

    result[path] = pathMethods;
  }

  return result;
};
