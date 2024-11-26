import { ActivityServiceMongooseService } from '@activity/activity/activity-service-mongoose.service';
import { ActivityDocument } from '@activity/activity/entities/mongoose/activity.schema';
import { ActivityCreateDto } from '@activity/activity/dto/activity.create.dto';
import { ActivityUpdateDto } from '@activity/activity/dto/activity.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import ActionsEnum from '@common/common/enums/ActionEnum';
import { activityProviders } from '@activity/activity/providers/activity.providers';
import { CommonModule } from '@common/common';
import { ResponseAfficoModule } from '@response-affico/response-affico';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@config/config';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('ActivityService', () => {
  let service: ActivityServiceMongooseService;
  let activity: ActivityDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, ResponseAfficoModule],
      providers: [ActivityServiceMongooseService],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === ActivityServiceMongooseService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<ActivityServiceMongooseService>(
      ActivityServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const activityDto: ActivityCreateDto = {
      resource: undefined,
      action: ActionsEnum.ALL,
      category: {
        id: 'id_category',
      },
      creator: {
        id: 'id_user',
      },
      object: {
        id: 'id_object',
      },
      name: 'mexico',
      description: '123456',
      objectBefore: undefined,
    };
    expect(
      service.create(activityDto).then((createdActivity) => {
        activity = createdActivity;
      }),
    ).toHaveProperty('name', activity.name);
  });

  it('should be update', () => {
    const activityDto: ActivityUpdateDto = {
      id: activity.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(activityDto.id, activityDto).then((updatedActivity) => {
        activity = updatedActivity;
      }),
    ).toHaveProperty('name', activityDto.name);
  });

  it('should be update', () => {
    expect(service.remove(activity.id)).toReturn();
  }); */
});
