import { UserServiceController } from './user-service.controller';
import { UserCreateDto } from '@user/user/dto/user.create.dto';
import { UserUpdateDto } from '@user/user/dto/user.update.dto';
import { UserServiceService } from './user-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserServiceController', () => {
  let user;
  let userServiceController: UserServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [UserServiceService],
    }).compile();

    userServiceController = app.get<UserServiceController>(
      UserServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const userDto: UserCreateDto = {
        active: false,
        affiliate: [],
        configuration: undefined,
        confirmPassword: '',
        description: '',
        email: '',
        image: undefined,
        ipAddress: [],
        personalData: undefined,
        role: undefined,
        twoFactorIsActive: false,
        twoFactorSecret: '',
        twoFactorQr: '',
        name: 'mexico',
        password: '123456',
        permissions: [],
      };
      expect(
        userServiceController.createOne(userDto).then((createdUser) => {
          user = createdUser;
        }),
      ).toHaveProperty('name', user.name);
    });

    it('should be update', () => {
      const userDto: UserUpdateDto = {
        id: user.id,
        name: 'colombia',
        password: '987654321',
      };
      expect(
        userServiceController.updateOne(userDto).then((updatedUser) => {
          user = updatedUser;
        }),
      ).toHaveProperty('username', userDto.name);
    });

    it('should be delete', () => {
      expect(userServiceController.deleteOneById(user.id)).toReturn();
    });
  });
});
