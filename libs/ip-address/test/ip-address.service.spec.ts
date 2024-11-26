import { IpAddressServiceMongooseService } from '@ip-address/ip-address/ip-address-service-mongoose.service';
import { IpAddressDocument } from '@ip-address/ip-address/entities/mongoose/ip-address.schema';
import { IpAddressCreateDto } from '@ip-address/ip-address/dto/ip-address.create.dto';
import { IpAddressUpdateDto } from '@ip-address/ip-address/dto/ip-address.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('IpAddressService', () => {
  let service: IpAddressServiceMongooseService;
  let ipAddress: IpAddressDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpAddressServiceMongooseService],
    }).compile();

    service = module.get<IpAddressServiceMongooseService>(
      IpAddressServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const ipAddressDto: IpAddressCreateDto = {
      active: false,
      ip: '',
      user: undefined,
      name: 'mexico',
      description: '123456',
    };
    expect(
      service.create(ipAddressDto).then((createdIpAddress) => {
        ipAddress = createdIpAddress;
      }),
    ).toHaveProperty('name', ipAddress.name);
  });

  it('should be update', () => {
    const ipAddressDto: IpAddressUpdateDto = {
      id: ipAddress.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(ipAddressDto.id, ipAddressDto).then((updatedIpAddress) => {
        ipAddress = updatedIpAddress;
      }),
    ).toHaveProperty('name', ipAddressDto.name);
  });

  it('should be update', () => {
    expect(service.remove(ipAddress.id)).toReturn();
  }); */
});
