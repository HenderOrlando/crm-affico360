import { CrmServiceController } from './crm-service.controller';
import { CrmCreateDto } from '@crm/crm/dto/crm.create.dto';
import { CrmUpdateDto } from '@crm/crm/dto/crm.update.dto';
import { CrmServiceService } from './crm-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CrmServiceController', () => {
  let crm;
  let crmServiceController: CrmServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CrmServiceController],
      providers: [CrmServiceService],
    }).compile();

    crmServiceController = app.get<CrmServiceController>(CrmServiceController);
  });

  describe('root', () => {
    it('should be create', () => {
      const crmDto: CrmCreateDto = {
        category: undefined,
        groupsPspOption: [],
        pspAvailable: [],
        status: undefined,
        statusAvailable: [],
        name: 'mexico',
        description: '123456',
        url: '',
        department: undefined,
        businessUnit: undefined,
        affiliates: [],
        buOwnerIdCrm: '',
        tradingPlatformIdCrm: '',
        organizationCrm: '',
        idCrm: '',
        secretCrm: '',
        userCrm: '',
        passwordCrm: '',
      };
      expect(
        crmServiceController.createOne(crmDto).then((createdCrm) => {
          crm = createdCrm;
        }),
      ).toHaveProperty('crmname', crm.crmname);
    });

    it('should be update', () => {
      const crmDto: CrmUpdateDto = {
        id: crm.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        crmServiceController.updateOne(crmDto).then((updatedCrm) => {
          crm = updatedCrm;
        }),
      ).toHaveProperty('name', crmDto.name);
    });

    it('should be delete', () => {
      expect(crmServiceController.deleteOneById(crm.id)).toReturn();
    });
  });
});
