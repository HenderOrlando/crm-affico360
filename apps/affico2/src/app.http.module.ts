import { JwtAuthGuard } from '@auth/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '@auth/auth/guards/policy.ability.guard';
import { Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SeedModule } from 'apps/seed-service/seed.module';
import { SeedService } from 'apps/seed-service/seed.service';
import { configApp } from './config.app.const';

const configHttp = {
  ...configApp,
};

configHttp.providers.push({
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
});

configHttp.providers.push({
  provide: APP_GUARD,
  useClass: PoliciesGuard,
});

configHttp.imports.push(SeedModule);

@Module(configHttp)
export class AppHttpModule implements OnModuleInit {
  constructor(private seedService: SeedService) {}

  async onModuleInit(): Promise<void> {
    await this.seedService.saveInitialData();
  }
}
