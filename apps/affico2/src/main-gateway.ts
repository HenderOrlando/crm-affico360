import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AffiliateServiceModule } from 'apps/affiliate-service/src/affiliate-service.module';
import { CategoryServiceModule } from 'apps/category-service/src/category-service.module';
import { CrmServiceModule } from 'apps/crm-service/src/crm-service.module';
import { LeadServiceModule } from 'apps/lead-service/src/lead-service.module';
import { PermissionServiceModule } from 'apps/permission-service/src/permission-service.module';
import { RoleServiceModule } from 'apps/role-service/src/role-service.module';
import { StatusServiceModule } from 'apps/status-service/src/status-service.module';
import * as basicAuth from 'express-basic-auth';
import { UserServiceModule } from '../../user-service/src/user-service.module';
import { AppHttpModule } from './app.http.module';

import { OpenAPIObject } from '@nestjs/swagger';
import { PathsObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { TransferServiceModule } from 'apps/transfer-service/src/transfer-service.module';

async function bootstrap(port?: number | string) {
  Logger.log(process.env.TZ, 'Timezone Gateway');
  port = port ?? process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppHttpModule, {
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

  addSwaggerGlobal(app);
  addSwaggerLead(app);
  addSwaggerIntegration(app);

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

function addSwaggerLead(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Affico 360 Api Affiliate')
    .setDescription('The affico 360 api affiliate endpoints')
    .setVersion('1.0')
    .addTag('Affiliate Lead')
    .addTag('Affiliate Category')
    .build();
  const leadDocument = SwaggerModule.createDocument(app, config, {
    include: [LeadServiceModule, CategoryServiceModule],
  });

  leadDocument.paths = filterDocumentsPathsByTags(leadDocument);
  SwaggerModule.setup('api/lead', app, leadDocument, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}

function addSwaggerIntegration(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Affico 360 Api Integration')
    .setDescription('The affico 360 api integration endpoints')
    .setVersion('1.0')
    .addTag('Integration Lead')
    .addTag('Integration Category')
    .build();
  const integrationDocument = SwaggerModule.createDocument(app, config, {
    include: [LeadServiceModule, CategoryServiceModule, TransferServiceModule],
  });

  integrationDocument.paths = filterDocumentsPathsByTags(integrationDocument);
  SwaggerModule.setup('api/integration', app, integrationDocument, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}

function addSwaggerGlobal(app: INestApplication) {
  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER || 'SWAGGER_USER']:
          process.env.SWAGGER_PASSWORD || 'Affico360_swagger',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Affico 360 Api')
    .setDescription('The affico 360 api endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        type: 'http',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const globalDocument = SwaggerModule.createDocument(app, config, {
    include: [
      CrmServiceModule,
      UserServiceModule,
      RoleServiceModule,
      LeadServiceModule,
      StatusServiceModule,
      AffiliateServiceModule,
      PermissionServiceModule,
    ],
  });

  SwaggerModule.setup('docs', app, globalDocument);
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

bootstrap();
//bootstrap(443);
