import { BusinessUnitModule } from '@business-unit/business-unit';
import { CategoryModule } from '@category/category';
import { CommonModule } from '@common/common';
import { CrmServiceMongooseService } from '@crm/crm/crm-service-mongoose.service';
import { GroupModule } from '@group/group';
import { IpAddressModule } from '@ip-address/ip-address';
import { Module } from '@nestjs/common';
import { PersonModule } from '@person/person';
import { PspModule } from '@psp/psp';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { StatusModule } from '@status/status';
import { TrafficModule } from '@traffic/traffic';
import { crmProviders } from './providers/crm.providers';

@Module({
  imports: [
    CommonModule,
    CrmModule,
    PspModule,
    StatusModule,
    GroupModule,
    CategoryModule,
    PersonModule,
    CommonModule,
    TrafficModule,
    IpAddressModule,
    BusinessUnitModule,
    ResponseAfficoModule,
  ],
  providers: [CrmServiceMongooseService, ...crmProviders],
  exports: [CrmServiceMongooseService, ...crmProviders],
})
export class CrmModule {}
