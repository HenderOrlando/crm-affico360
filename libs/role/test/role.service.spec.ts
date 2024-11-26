import { RoleServiceMongooseService } from '@role/role/role-service-mongoose.service';
import { RoleDocument } from '@role/role/entities/mongoose/role.schema';
import { RoleCreateDto } from '@role/role/dto/role.create.dto';
import { RoleUpdateDto } from '@role/role/dto/role.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('RoleService', () => {
  let service: RoleServiceMongooseService;
  let role: RoleDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleServiceMongooseService],
    }).compile();

    service = module.get<RoleServiceMongooseService>(
      RoleServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const roleDto: RoleCreateDto = {
      permissions: [],
      name: 'mexico',
      description: '123456',
      active: false,
    };
    expect(
      service.create(roleDto).then((createdRole) => {
        role = createdRole;
      }),
    ).toHaveProperty('name', role.name);
  });

  it('should be update', () => {
    const roleDto: RoleUpdateDto = {
      id: role.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(roleDto.id, roleDto).then((updatedRole) => {
        role = updatedRole;
      }),
    ).toHaveProperty('name', roleDto.name);
  });

  it('should be update', () => {
    expect(service.remove(role.id)).toReturn();
  }); */
});
