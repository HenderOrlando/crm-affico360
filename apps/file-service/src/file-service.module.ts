import { FileServiceController } from './file-service.controller';
import { FileServiceService } from './file-service.service';
import { BuildersModule } from '@builder/builders';
import { FileModule } from '@file/file';
import { Module } from '@nestjs/common';

@Module({
  imports: [FileModule, BuildersModule],
  controllers: [FileServiceController],
  providers: [FileServiceService],
})
export class FileServiceModule {}
