import { Test, TestingModule } from '@nestjs/testing';
import { LatamCashierService } from './latam.cashier.service';

describe('LeverateIntegrationService', () => {
  let service: LatamCashierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LatamCashierService],
    }).compile();

    service = module.get<LatamCashierService>(LatamCashierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
