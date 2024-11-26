import { AffiliateServiceController } from './affiliate-service.controller';
import { AffiliateCreateDto } from '@affiliate/affiliate/domain/dto/affiliate.create.dto';
import { AffiliateUpdateDto } from '@affiliate/affiliate/domain/dto/affiliate.update.dto';
import { AffiliateServiceService } from './affiliate-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AffiliateServiceController', () => {
  let affiliate;
  let affiliateServiceController: AffiliateServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateServiceController],
      providers: [AffiliateServiceService],
    }).compile();

    affiliateServiceController = app.get<AffiliateServiceController>(
      AffiliateServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const affiliateDto: AffiliateCreateDto = {
        conversionCost: 0,
        crm: undefined,
        personalData: undefined,
        businessUnit: undefined,
        group: undefined,
        ipAllowed: [],
        publicKey: '',
        user: undefined,
        name: 'mexico',
        description: '123456',
        docId: '',
        email: '',
        telephone: '',
        userId: undefined,
        creator: undefined,
      };
      expect(
        affiliateServiceController
          .createOne(affiliateDto)
          .then((createdAffiliate) => {
            affiliate = createdAffiliate;
          }),
      ).toHaveProperty('affiliatename', affiliate.affiliatename);
    });

    it('should be update', () => {
      const affiliateDto: AffiliateUpdateDto = {
        id: affiliate.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        affiliateServiceController
          .updateOne(affiliateDto)
          .then((updatedAffiliate) => {
            affiliate = updatedAffiliate;
          }),
      ).toHaveProperty('name', affiliateDto.name);
    });

    it('should be delete', () => {
      expect(affiliateServiceController.deleteOneById(affiliate.id)).toReturn();
    });
  });
});
