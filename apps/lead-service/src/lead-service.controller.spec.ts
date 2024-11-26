import { LeadServiceController } from './lead-service.controller';
import { LeadCreateDto } from '@lead/lead/dto/lead.create.dto';
import { LeadUpdateDto } from '@lead/lead/dto/lead.update.dto';
import { LeadServiceService } from './lead-service.service';
import { Test, TestingModule } from '@nestjs/testing';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';

describe('LeadServiceController', () => {
  let lead;
  let leadServiceController: LeadServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LeadServiceController],
      providers: [LeadServiceService],
    }).compile();

    leadServiceController = app.get<LeadServiceController>(
      LeadServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
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
        referralType: '',
        brand: undefined,
        searchText: '',
        showToAffiliate: false,
        hasSendDisclaimer: false,
        country: CountryCodeEnum.na,
        personalDataObj: undefined,
      };
      expect(
        leadServiceController.createOne(leadDto).then((createdLead) => {
          lead = createdLead;
        }),
      ).toHaveProperty('name', lead.name);
    });

    it('should be update', () => {
      const leadDto: LeadUpdateDto = {
        id: lead.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        leadServiceController.updateOne(leadDto).then((updatedLead) => {
          lead = updatedLead;
        }),
      ).toHaveProperty('name', leadDto.name);
    });

    it('should be delete', () => {
      expect(leadServiceController.deleteOneById(lead.id)).toReturn();
    });
  });
});
