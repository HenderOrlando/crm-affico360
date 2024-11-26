import { PersonServiceController } from './person-service.controller';
import { PersonServiceService } from './person-service.service';
import { PersonModule } from '@person/person';
import { BuildersModule } from '@builder/builders';
import { Module } from '@nestjs/common';

@Module({
  imports: [PersonModule, BuildersModule],
  controllers: [PersonServiceController],
  providers: [PersonServiceService],
})
export class PersonServiceModule {}
