import { UserDocument } from '@user/user/entities/mongoose/user.schema';
import { UserCreateDto } from '@user/user/dto/user.create.dto';
import { UserUpdateDto } from '@user/user/dto/user.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceMongooseService } from '@user/user';

describe('UserService', () => {
  let service: UserServiceMongooseService;
  let user: UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServiceMongooseService],
    }).compile();

    service = module.get<UserServiceMongooseService>(
      UserServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const userDto: UserCreateDto = {
      active: false,
      affiliate: undefined,
      configuration: undefined,
      confirmPassword: '',
      image: undefined,
      ipAddress: [],
      personalData: undefined,
      role: undefined,
      twoFactorIsActive: false,
      twoFactorSecret: '',
      twoFactorQr: '',
      name: '',
      description: '',
      email: 'mexico',
      password: '123456',
      permissions: [],
    };
    expect(
      service.create(userDto).then((createdUser) => {
        user = createdUser;
      }),
    ).toHaveProperty('username', user.username);
  });

  it('should be update', () => {
    const userDto: UserUpdateDto = {
      id: user.id,
      name: 'colombia',
      password: '987654321',
    };
    expect(
      service.update(userDto.id.toString(), userDto).then((updatedUser) => {
        user = updatedUser;
      }),
    ).toHaveProperty('name', userDto.name);
  });

  it('should be update', () => {
    expect(service.remove(user.id)).toReturn();
  }); */
});
