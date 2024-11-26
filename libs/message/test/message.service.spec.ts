import { MessageServiceMongooseService } from '@message/message/message-service-mongoose.service';
import { MessageDocument } from '@message/message/entities/mongoose/message.schema';
import { MessageCreateDto } from '@message/message/dto/message.create.dto';
import { MessageUpdateDto } from '@message/message/dto/message.update.dto';
import { ScopeDto } from '@permission/permission/dto/scope.dto';
import TransportEnum from '@common/common/enums/TransportEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';

describe('MessageService', () => {
  let service: MessageServiceMongooseService;
  let message: MessageDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageServiceMongooseService],
    }).compile();

    service = module.get<MessageServiceMongooseService>(
      MessageServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const messageDto: MessageCreateDto = {
      name: 'message between users',
      description: '',
      body: 'body',
      category: {
        id: new ObjectId('id_category'),
      },
      creator: {
        id: new ObjectId('id_user'),
      },
      destiny: {
        resourceId: new ObjectId('id_resource'),
        resourceName: ResourcesEnum.USER,
      } as ScopeDto,
      origin: {
        resourceId: new ObjectId('id_resource'),
        resourceName: ResourcesEnum.USER,
      } as ScopeDto,
      status: {
        id: new ObjectId('id_category'),
      },
      transport: TransportEnum.EMAIL,
    };
    expect(
      service.create(messageDto).then((createdMessage) => {
        message = createdMessage;
      }),
    ).toHaveProperty('id', message.id);
  });

  it('should be update', () => {
    const messageDto: MessageUpdateDto = {
      id: message.id,
      name: 'message',
    };
    expect(
      service
        .update(messageDto.id.toString(), messageDto)
        .then((updatedMessage) => {
          message = updatedMessage;
        }),
    ).toHaveProperty('name', messageDto.name);
  });

  it('should be update', () => {
    expect(service.remove(message.id)).toReturn();
  }); */
});
