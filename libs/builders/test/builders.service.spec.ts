import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import EventClientEnum from '@common/common/enums/EventsNameEnum';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseAfficoModule } from '@response-affico/response-affico';

describe('BuildersService', () => {
  let service: BuildersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ResponseAfficoModule],
      providers: [
        BuildersService,
        ConfigService,
        {
          provide: EventClientEnum.SERVICE_NAME,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.SERVICE_NAME,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.ACTIVITY,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.ACTIVITY,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.AFFILIATE,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.AFFILIATE,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.BUSINESS_UNIT,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.BUSINESS_UNIT,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.LEAD,
          useFactory: CommonService.factoryEventClient(EventClientEnum.LEAD),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.CRM,
          useFactory: CommonService.factoryEventClient(EventClientEnum.CRM),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.FILE,
          useFactory: CommonService.factoryEventClient(EventClientEnum.FILE),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.MESSAGE,
          useFactory: CommonService.factoryEventClient(EventClientEnum.MESSAGE),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.CATEGORY,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.CATEGORY,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.TRAFFIC,
          useFactory: CommonService.factoryEventClient(EventClientEnum.TRAFFIC),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.PERMISSION,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.PERMISSION,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.PERSON,
          useFactory: CommonService.factoryEventClient(EventClientEnum.PERSON),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.PSP,
          useFactory: CommonService.factoryEventClient(EventClientEnum.PSP),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.PSP_ACCOUNT,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.PSP_ACCOUNT,
          ),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.USER,
          useFactory: CommonService.factoryEventClient(EventClientEnum.USER),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.ROLE,
          useFactory: CommonService.factoryEventClient(EventClientEnum.ROLE),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.STATS,
          useFactory: CommonService.factoryEventClient(EventClientEnum.STATS),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.STATUS,
          useFactory: CommonService.factoryEventClient(EventClientEnum.STATUS),
          inject: [ConfigService],
        },
        {
          provide: EventClientEnum.TRANSFER,
          useFactory: CommonService.factoryEventClient(
            EventClientEnum.TRANSFER,
          ),
          inject: [ConfigService],
        },
      ],
    }).compile();

    service = module.get<BuildersService>(BuildersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
