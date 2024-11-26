import { PermissionCreateDto } from '@permission/permission/dto/permission.create.dto';
import { PermissionUpdateDto } from '@permission/permission/dto/permission.update.dto';
import { PermissionServiceController } from './permission-service.controller';
import { PermissionServiceService } from './permission-service.service';
import { Test, TestingModule } from '@nestjs/testing';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { TimeLiveDto } from '@permission/permission/dto/time.live.dto';

describe('PermissionServiceController', () => {
  let permission;
  let permissionServiceController: PermissionServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PermissionServiceController],
      providers: [PermissionServiceService],
    }).compile();

    permissionServiceController = app.get<PermissionServiceController>(
      PermissionServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const permissionDto: PermissionCreateDto = {
        scope: undefined,
        name: 'LOGIN',
        action: ActionsEnum.LOGIN,
        resource: ResourcesEnum.LEAD,
        description: '',
        timeLive: {
          from: new Date(),
          to: new Date(),
        } as TimeLiveDto,
        code: '',
      };
      expect(
        permissionServiceController
          .createOne(permissionDto)
          .then((createdPermission) => {
            permission = createdPermission;
          }),
      ).toHaveProperty('name', permission.name);
    });

    it('should be update', () => {
      const permissionDto: PermissionUpdateDto = {
        id: permission.id,
        name: 'LOGIN UPDATE',
      };
      expect(
        permissionServiceController
          .updateOne(permissionDto)
          .then((updatedPermission) => {
            permission = updatedPermission;
          }),
      ).toHaveProperty('name', permissionDto.name);
    });

    it('should be delete', () => {
      expect(
        permissionServiceController.deleteOneById(permission.id),
      ).toReturn();
    });
  });
});
