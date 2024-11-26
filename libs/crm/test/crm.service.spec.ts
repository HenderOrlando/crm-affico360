import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import { CrmServiceMongooseService } from '@crm/crm/crm-service-mongoose.service';
import { CrmCreateDto } from '@crm/crm/dto/crm.create.dto';
import { CrmUpdateDto } from '@crm/crm/dto/crm.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('CrmService', () => {
  let service: CrmServiceMongooseService;
  let crm: CrmDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrmServiceMongooseService],
    }).compile();

    service = module.get<CrmServiceMongooseService>(CrmServiceMongooseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const crmDto: CrmCreateDto = {
      category: undefined,
      groupsPspOption: undefined,
      pspAvailable: undefined,
      status: undefined,
      statusAvailable: undefined,
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
      service.create(crmDto).then((createdCrm) => {
        crm = createdCrm;
      }),
    ).toHaveProperty('name', crm.name);
  });

  it('should be update', () => {
    const crmDto: CrmUpdateDto = {
      id: crm.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(crmDto.id.toString(), crmDto).then((updatedCrm) => {
        crm = updatedCrm;
      }),
    ).toHaveProperty('name', crmDto.name);
  });

  it('should be update', () => {
    expect(service.remove(crm.id)).toReturn();
  }); */
});
