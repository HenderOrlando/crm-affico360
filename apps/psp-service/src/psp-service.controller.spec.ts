import { PspServiceController } from './psp-service.controller';
import { PspCreateDto } from '@psp/psp/dto/psp.create.dto';
import { PspUpdateDto } from '@psp/psp/dto/psp.update.dto';
import { PspServiceService } from './psp-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PspServiceController', () => {
  let psp;
  let pspServiceController: PspServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PspServiceController],
      providers: [PspServiceService],
    }).compile();

    pspServiceController = app.get<PspServiceController>(PspServiceController);
  });

  describe('root', () => {
    it('should be create', () => {
      const pspDto: PspCreateDto = {
        groups: [],
        status: undefined,
        name: 'mexico',
        description: '123456',
      };
      expect(
        pspServiceController.createOne(pspDto).then((createdPsp) => {
          psp = createdPsp;
        }),
      ).toHaveProperty('name', psp.name);
    });

    it('should be update', () => {
      const pspDto: PspUpdateDto = {
        id: psp.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        pspServiceController.updateOne(pspDto).then((updatedPsp) => {
          psp = updatedPsp;
        }),
      ).toHaveProperty('name', pspDto.name);
    });

    it('should be delete', () => {
      expect(pspServiceController.deleteOneById(psp.id)).toReturn();
    });
  });
});
