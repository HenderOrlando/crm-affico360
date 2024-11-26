import { IpAddressServiceMongooseService } from '@ip-address/ip-address/ip-address-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { ipAddressProviders } from './providers/ip-address.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [IpAddressServiceMongooseService, ...ipAddressProviders],
  exports: [IpAddressServiceMongooseService, ...ipAddressProviders],
})
export class IpAddressModule {}
