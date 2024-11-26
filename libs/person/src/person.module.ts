import { PersonServiceMongooseService } from '@person/person/person-service-mongoose.service';
import { personProviders } from './providers/person.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [PersonServiceMongooseService, ...personProviders],
  exports: [PersonServiceMongooseService, ...personProviders],
})
export class PersonModule {}
