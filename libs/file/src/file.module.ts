import { FileServiceMongooseService } from '@file/file/file-service-mongoose.service';
import { fileProviders } from './providers/file.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [FileServiceMongooseService, ...fileProviders],
  exports: [FileServiceMongooseService, ...fileProviders],
})
export class FileModule {}
