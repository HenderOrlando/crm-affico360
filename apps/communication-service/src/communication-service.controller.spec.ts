import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationServiceController } from './communication-service.controller';
import { CommunicationServiceService } from './communication-service.service';

describe('CommunicationServiceController', () => {
  let communicationServiceController: CommunicationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationServiceController],
      providers: [CommunicationServiceService],
    }).compile();

    communicationServiceController = app.get<CommunicationServiceController>(
      CommunicationServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(communicationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
