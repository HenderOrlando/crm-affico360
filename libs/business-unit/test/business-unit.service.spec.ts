import { BusinessUnitServiceMongooseService } from '@business-unit/business-unit/business-unit-service-mongoose.service';
import { BusinessUnitDocument } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { BusinessUnitCreateDto } from '@business-unit/business-unit/dto/business-unit.create.dto';
import { BusinessUnitUpdateDto } from '@business-unit/business-unit/dto/business-unit.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('BusinessUnitService', () => {
  let service: BusinessUnitServiceMongooseService;
  let businessUnit: BusinessUnitDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessUnitServiceMongooseService],
    }).compile();

    service = module.get<BusinessUnitServiceMongooseService>(
      BusinessUnitServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const businessUnitDto: BusinessUnitCreateDto = {
      crmList: [],
      pspList: [],
      name: 'mexico',
      description: '123456',
      slug: '',
      idCashier: '',
    };
    expect(
      service.create(businessUnitDto).then((createdBusinessUnit) => {
        businessUnit = createdBusinessUnit;
      }),
    ).toHaveProperty('name', businessUnit.name);
  });

  it('should be update', () => {
    const businessUnitDto: BusinessUnitUpdateDto = {
      id: businessUnit.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service
        .update(businessUnitDto.id, businessUnitDto)
        .then((updatedBusinessUnit) => {
          businessUnit = updatedBusinessUnit;
        }),
    ).toHaveProperty('name', businessUnitDto.name);
  });

  it('should be update', () => {
    expect(service.remove(businessUnit.id)).toReturn();
  }); */
});
