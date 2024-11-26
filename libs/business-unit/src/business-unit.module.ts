import { BusinessUnitServiceMongooseService } from '@business-unit/business-unit/business-unit-service-mongoose.service';
import { businessUnitProviders } from './providers/business-unit.providers';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [BusinessUnitServiceMongooseService, ...businessUnitProviders],
  exports: [BusinessUnitServiceMongooseService, ...businessUnitProviders],
})
export class BusinessUnitModule {}
