import { Module } from '@nestjs/common';
import { configApp } from './config.app.const';
import { JobModule } from 'apps/job-service/job.module';

const configMicroservice = {
  imports: [...new Set([...configApp.imports, ...[JobModule]])],
  controllers: [...new Set([...configApp.controllers])],
  providers: [...new Set([...configApp.providers])],
  exports: [...new Set([...configApp.exports])],
};

@Module(configMicroservice)
export class AppModule {}
