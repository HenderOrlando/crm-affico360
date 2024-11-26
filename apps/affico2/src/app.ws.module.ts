import { JwtAuthGuard } from '@auth/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '@auth/auth/guards/policy.ability.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { configApp } from './config.app.const';

const configWs = {
  ...configApp,
};

configWs.providers.push({
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
});

configWs.providers.push({
  provide: APP_GUARD,
  useClass: PoliciesGuard,
});

@Module(configWs)
export class AppWsModule {}
