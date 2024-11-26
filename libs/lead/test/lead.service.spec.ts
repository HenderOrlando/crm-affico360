import { LeadServiceMongooseService } from '@lead/lead/lead-service-mongoose.service';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { LeadCreateDto } from '@lead/lead/dto/lead.create.dto';
import { LeadUpdateDto } from '@lead/lead/dto/lead.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';

describe('LeadService', () => {
  let service: LeadServiceMongooseService;
  let lead: LeadDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadServiceMongooseService],
    }).compile();

    service = module.get<LeadServiceMongooseService>(
      LeadServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const leadDto: LeadCreateDto = {
      affiliate: undefined,
      crm: undefined,
      password: '',
      referral: '',
      name: 'mexico',
      description: '123456',
      docId: '',
      email: '',
      telephone: '',
      crmIdLead: '',
      country: CountryCodeEnum.Afghanistan,
      referralType: '',
      brand: undefined,
      searchText: '',
      showToAffiliate: false,
      hasSendDisclaimer: false,
      personalDataObj: undefined,
    };
    expect(
      service.create(leadDto).then((createdLead) => {
        lead = createdLead;
      }),
    ).toHaveProperty('name', lead.name);
  });

  it('should be update', () => {
    const leadDto: LeadUpdateDto = {
      id: lead.id,
      name: 'colombia',
      description: '987654321',
      affiliate: undefined,
    };
    expect(
      service.update(leadDto.id, leadDto).then((updatedLead) => {
        lead = updatedLead;
      }),
    ).toHaveProperty('name', leadDto.name);
  });

  it('should be update', () => {
    expect(service.remove(lead.id)).toReturn();
  }); */
});
