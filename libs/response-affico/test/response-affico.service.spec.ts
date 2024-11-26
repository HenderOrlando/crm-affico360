import { Test, TestingModule } from '@nestjs/testing';
import { ResponseAfficoService } from '@response-affico/response-affico';

describe('ResponseAfficoService', () => {
  let service: ResponseAfficoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseAfficoService],
    }).compile();

    service = module.get<ResponseAfficoService>(ResponseAfficoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
