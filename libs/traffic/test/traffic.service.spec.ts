import { TrafficServiceMongooseService } from '@traffic/traffic/traffic-service-mongoose.service';
import { TrafficDocument } from '@traffic/traffic/entities/mongoose/traffic.schema';
import { TrafficCreateDto } from '@traffic/traffic/dto/traffic.create.dto';
import { TrafficUpdateDto } from '@traffic/traffic/dto/traffic.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { trafficProviders } from '@traffic/traffic/providers/traffic.providers';

describe('TrafficService', () => {
  let service: TrafficServiceMongooseService;
  let traffic: TrafficDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficServiceMongooseService, ...trafficProviders],
    }).compile();

    service = module.get<TrafficServiceMongooseService>(
      TrafficServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const trafficDto: TrafficCreateDto = {
      name: 'mexico',
      startDate: undefined,
      endDate: undefined,
      nextTraffic: '',
      prevTraffic: '',
      person: '',
      affiliate: '',
      crm: '',
      businessUnit: '',
    };
    expect(
      service.create(trafficDto).then((createdTraffic) => {
        traffic = createdTraffic;
      }),
    ).toHaveProperty('name', traffic.name);
  });

  it('should be update', () => {
    const trafficDto: TrafficUpdateDto = {
      id: traffic.id,
      name: 'colombia',
    };
    expect(
      service.update(trafficDto.id, trafficDto).then((updatedTraffic) => {
        traffic = updatedTraffic;
      }),
    ).toHaveProperty('name', trafficDto.name);
  });

  it('should be update', () => {
    expect(service.remove(traffic.id)).toReturn();
  }); */
});
