import { BusinessUnitServiceController } from './business-unit-service.controller';
import { BusinessUnitServiceService } from './business-unit-service.service';
import { BuildersModule } from '@builder/builders';
import { BusinessUnitModule } from '@business-unit/business-unit';
import { Module } from '@nestjs/common';

@Module({
  imports: [BusinessUnitModule, BuildersModule],
  controllers: [BusinessUnitServiceController],
  providers: [BusinessUnitServiceService],
})
export class BusinessUnitServiceModule {}
