import { TransferServiceMongooseService } from '@transfer/transfer/transfer-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { transferProviders } from './providers/transfer.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [TransferServiceMongooseService, ...transferProviders],
  exports: [TransferServiceMongooseService, ...transferProviders],
})
export class TransferModule {}
