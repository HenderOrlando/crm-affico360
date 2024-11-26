import { AuthServiceController } from './auth-service.controller';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { BuildersModule } from '@builder/builders';
import { UserModule } from '@user/user';
import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth';

@Module({
  imports: [UserModule, BuildersModule, AuthModule],
  controllers: [UserServiceController, AuthServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
