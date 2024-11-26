import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, Transport } from '@nestjs/microservices';

@Injectable()
export class QueueAdminService {
  constructor(private readonly configService: ConfigService) {}
  getOptions(queue: string, noAck = false) {
    const host = this.configService.get<string>('RABBIT_MQ_HOST');
    const opts = {
      username: this.configService.get<string>('RABBIT_MQ_USERNAME'),
      password: this.configService.get<string>('RABBIT_MQ_PASSWORD'),
      host: host,
      port: this.configService.get<string>('RABBIT_MQ_PORT'),
      //queue: this.configService.get<string>(`RMQ_${queue}_QUEUE`),
      queue: this.configService.get<string>('RABBIT_MQ_QUEUE'),
      //queue: 'DEV',
      protocol: host === 'localhost' ? 'amqp' : 'amqps',
    };
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          `${opts.protocol}://${opts.username}:${opts.password}@${opts.host}:${opts.port}/`,
        ],
        queue: opts.queue,
        noAck,
        persistent: true,
        queueOptions: {
          durable: false,
        },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
