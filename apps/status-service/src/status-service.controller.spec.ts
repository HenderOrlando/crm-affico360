import { StatusCreateDto } from '@status/status/dto/status.create.dto';
import { StatusUpdateDto } from '@status/status/dto/status.update.dto';
import { StatusServiceController } from './status-service.controller';
import { StatusServiceService } from './status-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('StatusServiceController', () => {
  let status;
  let statusServiceController: StatusServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StatusServiceController],
      providers: [StatusServiceService],
    }).compile();

    statusServiceController = app.get<StatusServiceController>(
      StatusServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const statusDto: StatusCreateDto = {
        resources: [],
        name: 'mexico',
        description: '123456',
        idCashier: '',
        slug: '',
      };
      expect(
        statusServiceController.createOne(statusDto).then((createdStatus) => {
          status = createdStatus;
        }),
      ).toHaveProperty('name', status.name);
    });

    it('should be update', () => {
      const statusDto: StatusUpdateDto = {
        id: status.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        statusServiceController.updateOne(statusDto).then((updatedStatus) => {
          status = updatedStatus;
        }),
      ).toHaveProperty('name', statusDto.name);
    });

    it('should be delete', () => {
      expect(statusServiceController.deleteOneById(status.id)).toReturn();
    });
  });
});
