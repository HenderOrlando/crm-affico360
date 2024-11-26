import { StatusServiceMongooseService } from '@status/status/status-service-mongoose.service';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import { StatusCreateDto } from '@status/status/dto/status.create.dto';
import { StatusUpdateDto } from '@status/status/dto/status.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('StatusService', () => {
  let service: StatusServiceMongooseService;
  let status: StatusDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusServiceMongooseService],
    }).compile();

    service = module.get<StatusServiceMongooseService>(
      StatusServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const statusDto: StatusCreateDto = {
      resources: [],
      name: 'mexico',
      description: '123456',
      idCashier: '',
      slug: '',
    };
    expect(
      service.create(statusDto).then((createdStatus) => {
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
      service.update(statusDto.id, statusDto).then((updatedStatus) => {
        status = updatedStatus;
      }),
    ).toHaveProperty('name', statusDto.name);
  });

  it('should be update', () => {
    expect(service.remove(status.id)).toReturn();
  }); */
});
