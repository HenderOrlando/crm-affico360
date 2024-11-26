import { AffiliateServiceController } from './affiliate-service.controller';
import { AffiliateModule } from '@affiliate/affiliate';
import { BuildersModule } from '@builder/builders';
import { Module } from '@nestjs/common';
import { AffiliateServiceService } from './affiliate-service.service';

@Module({
  imports: [BuildersModule, AffiliateModule],
  controllers: [AffiliateServiceController],
  providers: [AffiliateServiceService],
})
export class AffiliateServiceModule {}
