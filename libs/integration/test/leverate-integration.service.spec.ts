import { LeverateIntegrationService } from '@integration/integration/crm/leverate-integration/leverate-integration.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('LeverateIntegrationService', () => {
  let service: LeverateIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeverateIntegrationService],
    }).compile();

    service = module.get<LeverateIntegrationService>(
      LeverateIntegrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
