import { BuildersModule } from '@builder/builders';
import { IntegrationService } from './integration.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BuildersModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
