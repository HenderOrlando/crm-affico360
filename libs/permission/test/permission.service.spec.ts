import { PermissionServiceMongooseService } from '@permission/permission/permission-service-mongoose.service';
import { PermissionDocument } from '@permission/permission/entities/mongoose/permission.schema';
import { PermissionCreateDto } from '@permission/permission/dto/permission.create.dto';
import { PermissionUpdateDto } from '@permission/permission/dto/permission.update.dto';
import { TimeLiveDto } from '@permission/permission/dto/time.live.dto';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import ActionsEnum from '@common/common/enums/ActionEnum';
import { Test, TestingModule } from '@nestjs/testing';

describe('PermissionService', () => {
  let service: PermissionServiceMongooseService;
  let permission: PermissionDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionServiceMongooseService],
    }).compile();

    service = module.get<PermissionServiceMongooseService>(
      PermissionServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const permissionDto: PermissionCreateDto = {
      scope: undefined,
      name: 'mexico',
      action: ActionsEnum.LOGIN,
      resource: ResourcesEnum.LEAD,
      description: '',
      timeLive: {} as TimeLiveDto,
      code: '',
    };
    expect(
      service.create(permissionDto).then((createdPermission) => {
        permission = createdPermission;
      }),
    ).toHaveProperty('name', permission.name);
  });

  it('should be update', () => {
    const permissionDto: PermissionUpdateDto = {
      id: permission.id,
      name: 'colombia',
    };
    expect(
      service
        .update(permissionDto.id, permissionDto)
        .then((updatedPermission) => {
          permission = updatedPermission;
        }),
    ).toHaveProperty('name', permissionDto.name);
  });

  it('should be update', () => {
    expect(service.remove(permission.id)).toReturn();
  }); */
});
