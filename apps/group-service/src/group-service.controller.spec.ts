import { GroupServiceController } from './group-service.controller';
import { GroupCreateDto } from '@group/group/dto/group.create.dto';
import { GroupUpdateDto } from '@group/group/dto/group.update.dto';
import { GroupServiceService } from './group-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('GroupServiceController', () => {
  let group;
  let groupServiceController: GroupServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GroupServiceController],
      providers: [GroupServiceService],
    }).compile();

    groupServiceController = app.get<GroupServiceController>(
      GroupServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const groupDto: GroupCreateDto = {
        category: undefined,
        status: undefined,
        name: 'mexico',
        description: '123456',
      };
      expect(
        groupServiceController.createOne(groupDto).then((createdGroup) => {
          group = createdGroup;
        }),
      ).toHaveProperty('groupname', group.groupname);
    });

    it('should be update', () => {
      const groupDto: GroupUpdateDto = {
        id: group.id,
        name: 'colombia',
        description: '987654321',
      };
      expect(
        groupServiceController.updateOne(groupDto).then((updatedGroup) => {
          group = updatedGroup;
        }),
      ).toHaveProperty('name', groupDto.name);
    });

    it('should be delete', () => {
      expect(groupServiceController.deleteOneById(group.id)).toReturn();
    });
  });
});
