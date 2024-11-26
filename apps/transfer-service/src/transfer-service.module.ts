import { TransferServiceController } from './transfer-service.controller';
import { TransferServiceService } from './transfer-service.service';
import { TransferModule } from '@transfer/transfer';
import { BuildersModule } from '@builder/builders';
import { Module } from '@nestjs/common';
import { LeadModule } from '@lead/lead';
import { PspAccountModule } from '@psp-account/psp-account';
import { CategoryModule } from '@category/category';
import { StatusModule } from '@status/status';
import { CrmModule } from '@crm/crm';
import { TransferServiceWebsocketGateway } from './transfer-service.websocket.gateway';
import { FileModule } from '@file/file';
import { FileServiceService } from 'apps/file-service/src/file-service.service';

@Module({
  imports: [
    CrmModule,
    LeadModule,
    FileModule,
    StatusModule,
    TransferModule,
    CategoryModule,
    BuildersModule,
    PspAccountModule,
  ],
  controllers: [TransferServiceController],
  providers: [
    FileServiceService,
    TransferServiceService,
    TransferServiceWebsocketGateway,
  ],
})
export class TransferServiceModule {}
