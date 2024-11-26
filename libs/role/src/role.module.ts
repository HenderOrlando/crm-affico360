import { RoleServiceMongooseService } from '@role/role/role-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { roleProviders } from './providers/role.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { PermissionModule } from '@permission/permission';

@Module({
  imports: [CommonModule, ResponseAfficoModule, PermissionModule],
  providers: [RoleServiceMongooseService, ...roleProviders],
  exports: [RoleServiceMongooseService, ...roleProviders],
})
export class RoleModule {}
