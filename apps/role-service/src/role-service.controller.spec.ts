import { RoleServiceController } from './role-service.controller';
import { RoleCreateDto } from '@role/role/dto/role.create.dto';
import { RoleUpdateDto } from '@role/role/dto/role.update.dto';
import { RoleServiceService } from './role-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('RoleServiceController', () => {
  let role;
  let roleServiceController: RoleServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoleServiceController],
      providers: [RoleServiceService],
    }).compile();

    roleServiceController = app.get<RoleServiceController>(
      RoleServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const roleDto: RoleCreateDto = {
        name: 'Role Julian',
        description: 'Description',
        active: false,
        permissions: [],
      };
      expect(
        roleServiceController.createOne(roleDto).then((createdRole) => {
          role = createdRole;
        }),
      ).toHaveProperty('rolename', role.rolename);
    });

    it('should be update', () => {
      const roleDto: RoleUpdateDto = {
        id: role.id,
        name: 'colombia',
      };
      expect(
        roleServiceController.updateOne(roleDto).then((updatedRole) => {
          role = updatedRole;
        }),
      ).toHaveProperty('name', roleDto.name);
    });

    it('should be delete', () => {
      expect(roleServiceController.deleteOneById(role.id)).toReturn();
    });
  });
});
