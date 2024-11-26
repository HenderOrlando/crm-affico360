import { GroupServiceMongooseService } from '../src/group-service-mongoose.service';
import { GroupCreateDto } from '@group/group/dto/group.create.dto';
import { GroupUpdateDto } from '@group/group/dto/group.update.dto';
import { GroupDocument } from '@group/group/entities/mongoose/group.schema';
import { Test, TestingModule } from '@nestjs/testing';

describe('GroupService', () => {
  let service: GroupServiceMongooseService;
  let group: GroupDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupServiceMongooseService],
    }).compile();

    service = module.get<GroupServiceMongooseService>(
      GroupServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const groupDto: GroupCreateDto = {
      name: 'mexico',
      description: '',
      status: undefined,
      category: undefined,
    };
    expect(
      service.create(groupDto).then((createdGroup) => {
        group = createdGroup;
      }),
    ).toHaveProperty('groupname', group.name);
  });

  it('should be update', () => {
    const groupDto: GroupUpdateDto = {
      id: group.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(groupDto.id, groupDto).then((updatedGroup) => {
        group = updatedGroup;
      }),
    ).toHaveProperty('groupname', groupDto.name);
  });

  it('should be update', () => {
    expect(service.remove(group.id)).toReturn();
  }); */
});
