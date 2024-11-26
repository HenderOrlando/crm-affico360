import { IpAddressServiceController } from './ip-address-service.controller';
import { IpAddressServiceService } from './ip-address-service.service';
import { IpAddressModule } from '@ip-address/ip-address';
import { BuildersModule } from '@builder/builders';
import { Module } from '@nestjs/common';

@Module({
  imports: [IpAddressModule, BuildersModule],
  controllers: [IpAddressServiceController],
  providers: [IpAddressServiceService],
})
export class IpAddressServiceModule {}
