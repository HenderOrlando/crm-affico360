import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { PolicyHandlerPersonCreate } from '@auth/auth/policy/person/policity.handler.person.create';
import { PolicyHandlerPersonDelete } from '@auth/auth/policy/person/policity.handler.person.delete';
import { PolicyHandlerPersonRead } from '@auth/auth/policy/person/policity.handler.person.read';
import { PolicyHandlerPersonUpdate } from '@auth/auth/policy/person/policity.handler.person.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PersonCreateDto } from '@person/person/dto/person.create.dto';
import { PersonUpdateDto } from '@person/person/dto/person.update.dto';
import EventsNamesPersonEnum from './enum/events.names.person.enum';
import { PersonServiceService } from './person-service.service';

@ApiTags('PERSON')
@Controller('person')
export class PersonServiceController implements GenericServiceController {
  constructor(private readonly personService: PersonServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerPersonRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.personService.getAll(query);
  }

  @Get(':personID')
  // @CheckPoliciesAbility(new PolicyHandlerPersonRead())
  async findOneById(@Param('personID') id: string) {
    return this.personService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerPersonCreate())
  async createOne(@Body() createPersonDto: PersonCreateDto) {
    return this.personService.newPerson(createPersonDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerPersonCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: PersonCreateDto }))
    createPersonsDto: PersonCreateDto[],
  ) {
    return this.personService.newManyPerson(createPersonsDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerPersonUpdate())
  async updateOne(@Body() updatePersonDto: PersonUpdateDto) {
    return this.personService.updatePerson(updatePersonDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerPersonUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: PersonUpdateDto }))
    updatePersonsDto: PersonUpdateDto[],
  ) {
    return this.personService.updateManyPersons(updatePersonsDto);
  }

  @Delete(':personID')
  // @CheckPoliciesAbility(new PolicyHandlerPersonDelete())
  async deleteOneById(@Param('personID') id: string) {
    return this.personService.deletePerson(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerPersonDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: PersonUpdateDto }))
    ids: PersonUpdateDto[],
  ) {
    return this.personService.deleteManyPersons(ids.map((person) => person.id));
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.createOne)
  createOneEvent(
    @Payload() createDto: PersonCreateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const person = this.createOne(createDto);
    CommonService.ack(ctx);
    return person;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.createMany)
  createManyEvent(
    @Payload() createsDto: PersonCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const person = this.createMany(createsDto);
    CommonService.ack(ctx);
    return person;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.updateOne)
  updateOneEvent(
    @Payload() updateDto: PersonUpdateDto,
    @Ctx() ctx: RmqContext,
  ) {
    const person = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return person;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: PersonUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const person = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return person;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: UpdateAnyDto[], @Ctx() ctx: RmqContext) {
    const person = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return person;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesPersonEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const person = this.deleteOneById(id);
    CommonService.ack(ctx);
    return person;
  }
}
