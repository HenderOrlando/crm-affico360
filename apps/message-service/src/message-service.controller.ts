import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { PolicyHandlerMessageCreate } from '@auth/auth/policy/message/policity.handler.message.create';
import { PolicyHandlerMessageDelete } from '@auth/auth/policy/message/policity.handler.message.delete';
import { PolicyHandlerMessageRead } from '@auth/auth/policy/message/policity.handler.message.read';
import { PolicyHandlerMessageUpdate } from '@auth/auth/policy/message/policity.handler.message.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { MessageCreateDto } from '@message/message/dto/message.create.dto';
import { MessageUpdateDto } from '@message/message/dto/message.update.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import EventsNamesMessageEnum from './enum/events.names.message.enum';
import { MessageServiceService } from './message-service.service';

@ApiTags('MESSAGE')
@Controller('message')
export class MessageServiceController implements GenericServiceController {
  constructor(private readonly messageService: MessageServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerMessageRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.messageService.getAll(query);
  }

  @Get(':messageID')
  // @CheckPoliciesAbility(new PolicyHandlerMessageRead())
  async findOneById(@Param('messageID') id: string) {
    return this.messageService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerMessageCreate())
  async createOne(@Body() createMessageDto: MessageCreateDto) {
    return this.messageService.newMessage(createMessageDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerMessageCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: MessageCreateDto }))
    createMessagesDto: MessageCreateDto[],
  ) {
    return this.messageService.newManyMessage(createMessagesDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerMessageUpdate())
  async updateOne(@Body() updateMessageDto: MessageUpdateDto) {
    return this.messageService.updateMessage(updateMessageDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerMessageUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: MessageUpdateDto }))
    updateMessagesDto: MessageUpdateDto[],
  ) {
    return this.messageService.updateManyMessages(updateMessagesDto);
  }

  @Delete(':messageID')
  // @CheckPoliciesAbility(new PolicyHandlerMessageDelete())
  async deleteOneById(@Param('messageID') id: string) {
    return this.messageService.deleteMessage(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerMessageDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: MessageUpdateDto }))
    ids: MessageUpdateDto[],
  ) {
    return this.messageService.deleteManyMessages(
      ids.map((message) => message.id),
    );
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.createOne)
  createOneEvent(
    @Payload() createDto: MessageCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const message = this.createOne(createDto);
    CommonService.ack(ctx);
    return message;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.createMany)
  createManyEvent(
    @Payload() createsDto: MessageCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const message = this.createMany(createsDto);
    CommonService.ack(ctx);
    return message;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.updateOne)
  updateOneEvent(
    @Payload() updateDto: MessageUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const message = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return message;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: MessageUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const message = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return message;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const message = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return message;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesMessageEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const message = this.deleteOneById(id);
    CommonService.ack(ctx);
    return message;
  }

  @AllowAnon()
  @EventPattern(EventsNamesMessageEnum.sendEmail)
  async eventSendEmail(@Payload() lead: LeadDocument, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    try {
      this.messageService.sendEmailDisclaimer(lead);
    } catch (err) {
      Logger.error(err, MessageServiceController.name);
    }
  }
}
