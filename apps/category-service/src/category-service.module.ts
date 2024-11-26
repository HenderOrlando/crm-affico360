import { CategoryServiceController } from './category-service.controller';
import { CategoryServiceService } from './category-service.service';
import { BuildersModule } from '@builder/builders';
import { CategoryModule } from '@category/category';
import { Module } from '@nestjs/common';

@Module({
  imports: [CategoryModule, BuildersModule],
  controllers: [CategoryServiceController],
  providers: [CategoryServiceService],
})
export class CategoryServiceModule {}
