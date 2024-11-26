import { CategoryServiceController } from './category-service.controller';
import { CategoryCreateDto } from '@category/category/dto/category.create.dto';
import { CategoryUpdateDto } from '@category/category/dto/category.update.dto';
import { CategoryServiceService } from './category-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CategoryServiceController', () => {
  let category;
  let categoryServiceController: CategoryServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoryServiceController],
      providers: [CategoryServiceService],
    }).compile();

    categoryServiceController = app.get<CategoryServiceController>(
      CategoryServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const categoryDto: CategoryCreateDto = {
        resources: [],
        type: '',
        name: 'mexico',
        description: '123456',
        slug: '',
        valueNumber: 0,
        valueText: '',
      };
      expect(
        categoryServiceController
          .createOne(categoryDto)
          .then((createdCategory) => {
            category = createdCategory;
          }),
      ).toHaveProperty('categoryname', category.categoryname);
    });

    it('should be update', () => {
      const categoryDto: CategoryUpdateDto = {
        id: category.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        categoryServiceController
          .updateOne(categoryDto)
          .then((updatedCategory) => {
            category = updatedCategory;
          }),
      ).toHaveProperty('name', categoryDto.name);
    });

    it('should be delete', () => {
      expect(categoryServiceController.deleteOneById(category.id)).toReturn();
    });
  });
});
