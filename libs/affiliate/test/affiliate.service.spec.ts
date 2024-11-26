import { AffiliateServiceMongooseService } from '@affiliate/affiliate/affiliate-service-mongoose.service';
import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { AffiliateCreateDto } from '@affiliate/affiliate/domain/dto/affiliate.create.dto';
import { AffiliateUpdateDto } from '@affiliate/affiliate/domain/dto/affiliate.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRegisterDto } from '@user/user/dto/user.register.dto';

describe('AffiliateService', () => {
  let service: AffiliateServiceMongooseService;
  let affiliate: AffiliateDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffiliateServiceMongooseService],
    }).compile();

    service = module.get<AffiliateServiceMongooseService>(
      AffiliateServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const affiliateDto: AffiliateCreateDto = {
      conversionCost: 0,
      crm: undefined,
      personalData: undefined,
      name: 'mexico',
      description: '123456',
      docId: '',
      email: '',
      telephone: '',
      userId: undefined,
      user: new UserRegisterDto(),
    };
    expect(
      service.create(affiliateDto).then((createdAffiliate) => {
        affiliate = createdAffiliate;
      }),
    ).toHaveProperty('name', affiliate.name);
  });

  it('should be update', () => {
    const affiliateDto: AffiliateUpdateDto = {
      id: affiliate.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(affiliateDto.id, affiliateDto).then((updatedAffiliate) => {
        affiliate = updatedAffiliate;
      }),
    ).toHaveProperty('name', affiliateDto.name);
  });

  it('should be update', () => {
    expect(service.remove(affiliate.id)).toReturn();
  }); */
});
