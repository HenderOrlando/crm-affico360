import { UserServiceMongooseService } from '@user/user/user-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { userProviders } from './providers/user.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { RoleModule } from '@role/role';

@Module({
  imports: [CommonModule, ResponseAfficoModule, RoleModule],
  providers: [UserServiceMongooseService, ...userProviders],
  exports: [UserServiceMongooseService, ...userProviders],
})
export class UserModule {}
