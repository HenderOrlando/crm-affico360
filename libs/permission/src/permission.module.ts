import { PermissionServiceMongooseService } from '@permission/permission/permission-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { permissionProviders } from './providers/permission.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [PermissionServiceMongooseService, ...permissionProviders],
  exports: [PermissionServiceMongooseService, ...permissionProviders],
})
export class PermissionModule {}
