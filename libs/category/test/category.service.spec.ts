import { CategoryDocument } from '@category/category/entities/mongoose/category.schema';
import { CategoryCreateDto } from '@category/category/dto/category.create.dto';
import { CategoryUpdateDto } from '@category/category/dto/category.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryServiceMongooseService } from '@category/category';

describe('CategoryService', () => {
  let service: CategoryServiceMongooseService;
  let category: CategoryDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryServiceMongooseService],
    }).compile();

    service = module.get<CategoryServiceMongooseService>(
      CategoryServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
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
      service.create(categoryDto).then((createdCategory) => {
        category = createdCategory;
      }),
    ).toHaveProperty('name', category.name);
  });

  it('should be update', () => {
    const categoryDto: CategoryUpdateDto = {
      id: category.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(categoryDto.id, categoryDto).then((updatedCategory) => {
        category = updatedCategory;
      }),
    ).toHaveProperty('name', categoryDto.name);
  });

  it('should be update', () => {
    expect(service.remove(category.id)).toReturn();
  }); */
});
