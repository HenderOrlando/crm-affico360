import { Module } from '@nestjs/common';
import { CommunicationServiceController } from './communication-service.controller';
import { CommunicationServiceService } from './communication-service.service';

@Module({
  imports: [],
  controllers: [CommunicationServiceController],
  providers: [CommunicationServiceService],
})
export class CommunicationServiceModule {}
