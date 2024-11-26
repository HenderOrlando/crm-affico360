import { MessageServiceController } from './message-service.controller';
import { MessageServiceService } from './message-service.service';
import { BuildersModule } from '@builder/builders';
import { MessageModule } from '@message/message';
import { Module } from '@nestjs/common';

@Module({
  imports: [MessageModule, BuildersModule],
  controllers: [MessageServiceController],
  providers: [MessageServiceService],
})
export class MessageServiceModule {}
