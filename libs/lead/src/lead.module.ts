import { AffiliateModule } from '@affiliate/affiliate';
import { BusinessUnitModule } from '@business-unit/business-unit';
import { CategoryModule } from '@category/category';
import { CommonModule } from '@common/common';
import { CrmModule } from '@crm/crm';
import { LeadPspServiceMongooseService } from '@lead/lead/lead-psp-service-mongoose.service';
import { LeadServiceMongooseService } from '@lead/lead/lead-service-mongoose.service';
import { Module } from '@nestjs/common';
import { PersonModule } from '@person/person';
import { PspAccountModule } from '@psp-account/psp-account';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { StatusModule } from '@status/status';
import { TransferModule } from '@transfer/transfer';
import { UserModule } from '@user/user';
import { leadProviders } from './providers/lead.providers';
import { BuildersModule } from '@builder/builders';

@Module({
  imports: [
    UserModule,
    CrmModule,
    CommonModule,
    StatusModule,
    PersonModule,
    PspAccountModule,
    TransferModule,
    //TrafficModule,
    BuildersModule,
    CategoryModule,
    AffiliateModule,
    BusinessUnitModule,
    ResponseAfficoModule,
  ],
  providers: [
    LeadServiceMongooseService,
    LeadPspServiceMongooseService,
    ...leadProviders,
  ],
  exports: [
    LeadServiceMongooseService,
    LeadPspServiceMongooseService,
    ...leadProviders,
  ],
})
export class LeadModule {}
