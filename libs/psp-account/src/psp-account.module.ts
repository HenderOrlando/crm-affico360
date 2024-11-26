import { PspAccountServiceMongooseService } from '@psp-account/psp-account/psp-account-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { PspAccountProviders } from './providers/psp-account.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [PspAccountServiceMongooseService, ...PspAccountProviders],
  exports: [PspAccountServiceMongooseService, ...PspAccountProviders],
})
export class PspAccountModule {}
