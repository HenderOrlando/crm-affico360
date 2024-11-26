import { PspServiceMongooseService } from '@psp/psp/psp-service-mongoose.service';
import { PspDocument } from '@psp/psp/entities/mongoose/psp.schema';
import { PspCreateDto } from '@psp/psp/dto/psp.create.dto';
import { PspUpdateDto } from '@psp/psp/dto/psp.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('PspService', () => {
  let service: PspServiceMongooseService;
  let psp: PspDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PspServiceMongooseService],
    }).compile();

    service = module.get<PspServiceMongooseService>(PspServiceMongooseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const pspDto: PspCreateDto = {
      groups: [],
      status: undefined,
      name: 'mexico',
      description: '123456',
    };
    expect(
      service.create(pspDto).then((createdPsp) => {
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
      service.update(pspDto.id, pspDto).then((updatedPsp) => {
        psp = updatedPsp;
      }),
    ).toHaveProperty('name', pspDto.name);
  });

  it('should be update', () => {
    expect(service.remove(psp.id)).toReturn();
  }); */
});
