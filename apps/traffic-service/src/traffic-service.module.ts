import { TrafficServiceController } from './traffic-service.controller';
import { TrafficServiceService } from './traffic-service.service';
import { BuildersModule } from '@builder/builders';
import { TrafficModule } from '@traffic/traffic';
import { Module } from '@nestjs/common';
import { AffiliateModule } from '@affiliate/affiliate';

@Module({
  imports: [AffiliateModule, TrafficModule, BuildersModule],
  controllers: [TrafficServiceController],
  providers: [TrafficServiceService],
})
export class TrafficServiceModule {}
