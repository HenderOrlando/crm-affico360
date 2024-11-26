import { PspServiceController } from './psp-service.controller';
import { PspServiceService } from './psp-service.service';
import { BuildersModule } from '@builder/builders';
import { Module } from '@nestjs/common';
import { PspModule } from '@psp/psp';
import { PspAccountServiceService } from './psp.account.service.service';
import { PspAccountModule } from '@psp-account/psp-account';
import { PspAccountController } from './psp.account.controller';

@Module({
  imports: [PspModule, PspAccountModule, BuildersModule],
  controllers: [PspServiceController, PspAccountController],
  providers: [PspServiceService, PspAccountServiceService],
})
export class PspServiceModule {}
