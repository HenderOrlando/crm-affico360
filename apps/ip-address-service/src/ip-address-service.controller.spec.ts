import { Test, TestingModule } from '@nestjs/testing';
import { IpAddressCreateDto } from '@ip-address/ip-address/dto/ip-address.create.dto';
import { IpAddressUpdateDto } from '@ip-address/ip-address/dto/ip-address.update.dto';
import { IpAddressServiceController } from './ip-address-service.controller';
import { IpAddressServiceService } from './ip-address-service.service';

describe('IpAddressServiceController', () => {
  let ipAddress;
  let ipAddressServiceController: IpAddressServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IpAddressServiceController],
      providers: [IpAddressServiceService],
    }).compile();

    ipAddressServiceController = app.get<IpAddressServiceController>(
      IpAddressServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const ipAddressDto: IpAddressCreateDto = {
        active: false,
        ip: '',
        user: undefined,
        name: 'mexico',
        description: '123456',
      };
      expect(
        ipAddressServiceController
          .createOne(ipAddressDto)
          .then((createdIpAddress) => {
            ipAddress = createdIpAddress;
          }),
      ).toHaveProperty('ipAddressname', ipAddress.ipAddressname);
    });

    it('should be update', () => {
      const ipAddressDto: IpAddressUpdateDto = {
        id: ipAddress.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        ipAddressServiceController
          .updateOne(ipAddressDto)
          .then((updatedIpAddress) => {
            ipAddress = updatedIpAddress;
          }),
      ).toHaveProperty('ipAddressname', ipAddressDto.name);
    });

    it('should be delete', () => {
      expect(ipAddressServiceController.deleteOneById(ipAddress.id)).toReturn();
    });
  });
});
