import { Test, TestingModule } from '@nestjs/testing';
import { StatsServiceController } from './stats-service.controller';
import { StatsServiceService } from './stats-service.service';

describe('StatsServiceController', () => {
  let statsServiceController: StatsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StatsServiceController],
      providers: [StatsServiceService],
    }).compile();

    statsServiceController = app.get<StatsServiceController>(
      StatsServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(statsServiceController.getStatsAffiliate({})).toBe('Hello World!');
    });
  });
});
