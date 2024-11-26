import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { StatsDateAffiliateServiceMongooseService } from '@stats/stats';
import { StatsDateCreateDto } from '@stats/stats/dto/stats.date.create.dto';
import { StatsDateUpdateDto } from '@stats/stats/dto/stats.date.update.dto';
import { StatsDateAffiliateDocument } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';

describe('StatsDateAffiliateService', () => {
  let service: StatsDateAffiliateServiceMongooseService;
  let stats: StatsDateAffiliateDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsDateAffiliateServiceMongooseService],
    }).compile();

    service = module.get<StatsDateAffiliateServiceMongooseService>(
      StatsDateAffiliateServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const statsDto: StatsDateCreateDto = {
      name: 'mexico',
      description: '123456',
      totalLeads: 0,
      totalFtd: 0,
      totalCftd: 0,
      totalConvertion: 0,
      affiliateFtd: 0,
      affiliateConvertion: 0,
      realLeads: 0,
      realFtd: 0,
      realCftd: 0,
      realConvertion: 0,
      rateLeads: 0,
      rateFtd: 0,
      rateConvertion: 0,
      country: CountryCodeEnum.na,
      affiliate: null,
      brand: null,
    } as unknown as StatsDateCreateDto;
    expect(
      service.create(statsDto).then((createdStats) => {
        stats = createdStats;
      }),
    ).toHaveProperty('name', stats.name);
  });

  it('should be update', () => {
    const statsDto: StatsDateUpdateDto = {
      id: stats.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(statsDto.id.toString(), statsDto).then((updatedStats) => {
        stats = updatedStats;
      }),
    ).toHaveProperty('name', statsDto.name);
  });

  it('should be update', () => {
    expect(service.remove(stats.id)).toReturn();
  }); */
});
