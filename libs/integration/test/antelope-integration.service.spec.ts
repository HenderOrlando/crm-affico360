import { AntelopeIntegrationService } from '@integration/integration/crm/antelope-integration/antelope-integration.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AntelopeIntegrationService', () => {
  let service: AntelopeIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntelopeIntegrationService],
    }).compile();

    service = module.get<AntelopeIntegrationService>(
      AntelopeIntegrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
