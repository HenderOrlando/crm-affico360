import { Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/auth/guards/jwt-auth.guard';
import { SeedService } from 'apps/seed-service/seed.service';
import { configApp } from './config.app.const';
import { SeedModule } from 'apps/seed-service/seed.module';
import { JobModule } from 'apps/job-service/job.module';
import { PoliciesGuard } from '@auth/auth/guards/policy.ability.guard';

const configHttp = {
  ...configApp,
};

configHttp.imports.push(JobModule);

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
export class AppJobModule implements OnModuleInit {
  constructor(private seedService: SeedService) {}

  async onModuleInit(): Promise<void> {
    await this.seedService.saveInitialData();
  }
}
