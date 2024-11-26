import { RoleServiceController } from './role-service.controller';
import { RoleServiceService } from './role-service.service';
import { BuildersModule } from '@builder/builders';
import { RoleModule } from '@role/role';
import { Module } from '@nestjs/common';

@Module({
  imports: [RoleModule, BuildersModule],
  controllers: [RoleServiceController],
  providers: [RoleServiceService],
})
export class RoleServiceModule {}
