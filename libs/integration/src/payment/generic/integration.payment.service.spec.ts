import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationPaymentService } from './integration.payment.service';

describe('LeverateIntegrationService', () => {
  let service: IntegrationPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationPaymentService],
    }).compile();

    service = module.get<IntegrationPaymentService>(IntegrationPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
