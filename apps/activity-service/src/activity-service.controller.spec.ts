import { ActivityCreateDto } from '@activity/activity/dto/activity.create.dto';
import { ActivityUpdateDto } from '@activity/activity/dto/activity.update.dto';
import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityServiceController } from './activity-service.controller';
import { ActivityServiceService } from './activity-service.service';
import { ActivityModule } from '@activity/activity';
import { BuildersModule } from '@builder/builders';
import { ActivityServiceWebsocketGateway } from './activity-service.websocket.gateway';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';

describe('ActivityServiceController', () => {
  let activity;
  let activityServiceController: ActivityServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ActivityModule, BuildersModule],
      controllers: [ActivityServiceController],
      providers: [ActivityServiceService],
    }).compile();

    activityServiceController = app.get<ActivityServiceController>(
      ActivityServiceController,
    );
  });

  it('should be create', () => {
    const activityDto: ActivityCreateDto = {
      resource: ResourcesEnum.ACTIVITY,
      action: ActionsEnum.CREATE,
      category: null,
      creator: undefined,
      objectBefore: null,
      object: {
        name: 'Test activity created',
        description: 'Activity created',
      },
      name: 'Test activity created',
      description: 'Activity created',
    };
    expect(
      activityServiceController
        .createOne(activityDto)
        .then((createdActivity) => {
          activity = createdActivity;
          return activity;
        }),
    ).toHaveProperty('name', activity.name);
  });

  /* describe('root', () => {
    it('should be create', () => {
      const activityDto: ActivityCreateDto = {
        resource: ResourcesEnum.ACTIVITY,
        action: ActionsEnum.CREATE,
        category: null,
        creator: undefined,
        objectBefore: null,
        object: {
          name: 'Test activity created',
          description: 'Activity created',
        },
        name: 'Test activity created',
        description: 'Activity created',
      };
      expect(
        activityServiceController
          .createOne(activityDto)
          .then((createdActivity) => {
            activity = createdActivity;
            return activity;
          }),
      ).toHaveProperty('name', activity.name);
    });

    it('should be update', () => {
      const activityDto: ActivityUpdateDto = {
        id: activity.id,
        name: 'Test activity updated',
        description: 'Activity updated',
      };
      expect(
        activityServiceController
          .updateOne(activityDto)
          .then((updatedActivity) => {
            activity = updatedActivity;
          }),
      ).toHaveProperty('description', activityDto.description);
    });

    it('should be filter[where]', () => {
      const queryDto: QuerySearchAnyDto = {
        where: {
          name: activity.name,
        },
      };
      expect(activityServiceController.findAll(queryDto)).toHaveProperty(
        'totalElements',
        1,
      );
    });

    it('should be delete', () => {
      expect(activityServiceController.deleteOneById(activity.id)).toReturn();
    });
  }); */
});
