import { MessageServiceMongooseService } from '@message/message/message-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { MessageProviders } from './providers/messageProviders';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [MessageServiceMongooseService, ...MessageProviders],
  exports: [MessageServiceMongooseService, ...MessageProviders],
})
export class MessageModule {}
