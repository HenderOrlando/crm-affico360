import { MessageDocument } from '@message/message/entities/mongoose/message.schema';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { MessageCreateDto } from '@message/message/dto/message.create.dto';
import { MessageUpdateDto } from '@message/message/dto/message.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MessageServiceMongooseService extends BasicServiceModel<
  MessageDocument,
  Model<MessageDocument>,
  MessageCreateDto,
  MessageUpdateDto
> {
  constructor(
    @Inject('MESSAGE_MODEL_MONGOOSE')
    messageModel: Model<MessageDocument>,
  ) {
    super(messageModel);
  }
}
