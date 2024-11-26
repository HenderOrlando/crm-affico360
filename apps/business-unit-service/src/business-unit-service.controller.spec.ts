import { BusinessUnitServiceController } from './business-unit-service.controller';
import { BusinessUnitCreateDto } from '@business-unit/business-unit/dto/business-unit.create.dto';
import { BusinessUnitUpdateDto } from '@business-unit/business-unit/dto/business-unit.update.dto';
import { BusinessUnitServiceService } from './business-unit-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('BusinessUnitServiceController', () => {
  let businessUnit;
  let businessUnitServiceController: BusinessUnitServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitServiceController],
      providers: [BusinessUnitServiceService],
    }).compile();

    businessUnitServiceController = app.get<BusinessUnitServiceController>(
      BusinessUnitServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const businessUnitDto: BusinessUnitCreateDto = {
        crmList: [],
        description: '',
        name: '',
        pspList: [],
        slug: '',
        idCashier: '',
      };
      expect(
        businessUnitServiceController
          .createOne(businessUnitDto)
          .then((createdBusinessUnit) => {
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
        businessUnitServiceController
          .updateOne(businessUnitDto)
          .then((updatedBusinessUnit) => {
            businessUnit = updatedBusinessUnit;
          }),
      ).toHaveProperty('name', businessUnitDto.name);
    });

    it('should be delete', () => {
      expect(
        businessUnitServiceController.deleteOneById(businessUnit.id),
      ).toReturn();
    });
  });
});
