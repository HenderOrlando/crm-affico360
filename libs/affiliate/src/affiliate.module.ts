import { AffiliateServiceMongooseService } from '@affiliate/affiliate/affiliate-service-mongoose.service';
import { BusinessUnitModule } from '@business-unit/business-unit';
import { CommonModule } from '@common/common';
import { CrmModule } from '@crm/crm';
import { GroupModule } from '@group/group';
import { IpAddressModule } from '@ip-address/ip-address';
import { Module } from '@nestjs/common';
import { PersonModule } from '@person/person';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { TrafficModule } from '@traffic/traffic';
import { UserModule } from '@user/user';
import { affiliateProviders } from './infrastructure/mongoose/affiliate.providers';

@Module({
  imports: [
    CrmModule,
    UserModule,
    GroupModule,
    PersonModule,
    CommonModule,
    TrafficModule,
    IpAddressModule,
    BusinessUnitModule,
    ResponseAfficoModule,
  ],
  providers: [AffiliateServiceMongooseService, ...affiliateProviders],
  exports: [AffiliateServiceMongooseService, ...affiliateProviders],
})
export class AffiliateModule {}
