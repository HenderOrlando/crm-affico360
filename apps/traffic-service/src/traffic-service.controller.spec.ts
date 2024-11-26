import { TrafficServiceService } from './traffic-service.service';
import { TrafficServiceController } from './traffic-service.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('TrafficServiceController', () => {
  let trafficServiceController: TrafficServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TrafficServiceController],
      providers: [TrafficServiceService],
    }).compile();

    trafficServiceController = app.get<TrafficServiceController>(
      TrafficServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(trafficServiceController.findAll({})).toBe('Hello World!');
    });
  });
});
