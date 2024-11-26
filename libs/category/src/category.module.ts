import { CategoryServiceMongooseService } from '@category/category/category-service-mongoose.service';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { categoryProviders } from './providers/category.providers';
import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, ResponseAfficoModule],
  providers: [CategoryServiceMongooseService, ...categoryProviders],
  exports: [CategoryServiceMongooseService, ...categoryProviders],
})
export class CategoryModule {}
