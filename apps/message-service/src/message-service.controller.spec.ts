import { MessageCreateDto } from '@message/message/dto/message.create.dto';
import { MessageUpdateDto } from '@message/message/dto/message.update.dto';
import { MessageServiceController } from './message-service.controller';
import { MessageServiceService } from './message-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('MessageServiceController', () => {
  let message;
  let messageServiceController: MessageServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessageServiceController],
      providers: [MessageServiceService],
    }).compile();

    messageServiceController = app.get<MessageServiceController>(
      MessageServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const messageDto: MessageCreateDto = {
        body: 'ok',
        category: undefined,
        creator: undefined,
        destiny: undefined,
        origin: undefined,
        status: undefined,
        transport: undefined,
        name: 'mexico',
        description: '123456',
      };
      expect(
        messageServiceController
          .createOne(messageDto)
          .then((createdMessage) => {
            message = createdMessage;
          }),
      ).toHaveProperty('messagename', message.messagename);
    });

    it('should be update', () => {
      const messageDto: MessageUpdateDto = {
        id: message.id,
        name: 'colombia',
      };
      expect(
        messageServiceController
          .updateOne(messageDto)
          .then((updatedMessage) => {
            message = updatedMessage;
          }),
      ).toHaveProperty('name', messageDto.name);
    });

    it('should be delete', () => {
      expect(messageServiceController.deleteOneById(message.id)).toReturn();
    });
  });
});
