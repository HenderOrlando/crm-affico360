import { DynamicModule, Module } from '@nestjs/common';
import { QueueAdminService } from './queue.admin.provider.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [QueueAdminService],
  exports: [QueueAdminService],
})
export class QueueAdminModule {
  static register({
    name,
    noAck = false,
  }: QueueAdminModuleOptions): DynamicModule {
    return {
      module: QueueAdminModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => {
              const host = configService.get<string>('RABBIT_MQ_HOST');
              const opts = {
                username: configService.get<string>('RABBIT_MQ_USERNAME'),
                password: configService.get<string>('RABBIT_MQ_PASSWORD'),
                host: host,
                port: configService.get<string>('RABBIT_MQ_PORT'),
                //queue: configService.get<string>(`RMQ_${name}_QUEUE`),
                queue: configService.get<string>('RABBIT_MQ_QUEUE'),
                //queue: 'DEV',
                protocol: host === 'localhost' ? 'amqp' : 'amqps',
              };
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [
                    `${opts.protocol}://${opts.username}:${opts.password}@${opts.host}:${opts.port}/`,
                  ],
                  noAck,
                  queue: opts.queue,
                  persistent: true,
                  queueOptions: {
                    durable: false,
                  },
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}

interface QueueAdminModuleOptions {
  name: string;
  noAck?: boolean;
}
