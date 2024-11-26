import { TransferServiceService } from './transfer-service.service';
import { TransferServiceController } from './transfer-service.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('TransferServiceController', () => {
  let transferServiceController: TransferServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransferServiceController],
      providers: [TransferServiceService],
    }).compile();

    transferServiceController = app.get<TransferServiceController>(
      TransferServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await transferServiceController.findAll({})).toBe('Hello World!');
    });
  });
});
