import { PspServiceMongooseService } from '@psp/psp/psp-service-mongoose.service';
import { pspProviders } from './providers/psp.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [PspServiceMongooseService, ...pspProviders],
  exports: [PspServiceMongooseService, ...pspProviders],
})
export class PspModule {}
