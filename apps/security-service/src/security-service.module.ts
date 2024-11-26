import { SecurityServiceController } from './security-service.controller';
import { SecurityServiceService } from './security-service.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SecurityServiceController],
  providers: [SecurityServiceService],
})
export class SecurityServiceModule {}
