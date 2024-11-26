import { PermissionServiceController } from './permission-service.controller';
import { PermissionServiceService } from './permission-service.service';
import { PermissionModule } from '@permission/permission';
import { BuildersModule } from '@builder/builders';
import { Module } from '@nestjs/common';

@Module({
  imports: [PermissionModule, BuildersModule],
  controllers: [PermissionServiceController],
  providers: [PermissionServiceService],
})
export class PermissionServiceModule {}
