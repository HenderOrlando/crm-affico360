import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResponseAfficoService } from './response-affico.service';

@Module({
  imports: [ConfigModule],
  providers: [ResponseAfficoService],
  exports: [ResponseAfficoService],
})
export class ResponseAfficoModule {}
