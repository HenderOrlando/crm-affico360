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
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { PolicyHandlerFileCreate } from '@auth/auth/policy/file/policity.handler.file.create';
import { PolicyHandlerFileDelete } from '@auth/auth/policy/file/policity.handler.file.delete';
import { PolicyHandlerFileRead } from '@auth/auth/policy/file/policity.handler.file.read';
import { PolicyHandlerFileUpdate } from '@auth/auth/policy/file/policity.handler.file.update';
import { CheckPoliciesAbility } from '@auth/auth/policy/policy.handler.ability';
import { CommonService } from '@common/common';
import GenericServiceController from '@common/common/interfaces/controller.generic.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { UpdateAnyDto } from '@common/common/models/update-any.dto';
import { FileCreateDto } from '@file/file/dto/file.create.dto';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Response as ExpressResponse } from 'express';
import EventsNamesFileEnum from './enum/events.names.file.enum';
import { FileServiceService } from './file-service.service';

@ApiTags('FILE')
@Controller('file')
export class FileServiceController implements GenericServiceController {
  constructor(private readonly fileService: FileServiceService) {}

  @Get('all')
  // @CheckPoliciesAbility(new PolicyHandlerFileRead())
  async findAll(@Query() query: QuerySearchAnyDto) {
    return this.fileService.getAll(query);
  }

  @Get(':fileID')
  // @CheckPoliciesAbility(new PolicyHandlerFileRead())
  async findOneById(@Param('fileID') id: string) {
    return this.fileService.getOne(id);
  }

  @Post()
  // @CheckPoliciesAbility(new PolicyHandlerFileCreate())
  async createOne(@Body() createFileDto: FileCreateDto) {
    return this.fileService.newFile(createFileDto);
  }

  @Post('all')
  // @CheckPoliciesAbility(new PolicyHandlerFileCreate())
  async createMany(
    @Body(new ParseArrayPipe({ items: FileCreateDto }))
    createFilesDto: FileCreateDto[],
  ) {
    return this.fileService.newManyFile(createFilesDto);
  }

  @Patch()
  // @CheckPoliciesAbility(new PolicyHandlerFileUpdate())
  async updateOne(@Body() updateFileDto: FileUpdateDto) {
    return this.fileService.updateFile(updateFileDto);
  }

  @Patch('all')
  // @CheckPoliciesAbility(new PolicyHandlerFileUpdate())
  async updateMany(
    @Body(new ParseArrayPipe({ items: FileUpdateDto }))
    updateFilesDto: FileUpdateDto[],
  ) {
    return this.fileService.updateManyFiles(updateFilesDto);
  }

  @Delete(':fileID')
  // @CheckPoliciesAbility(new PolicyHandlerFileDelete())
  async deleteOneById(@Param('fileID') id: string) {
    return this.fileService.deleteFile(id);
  }

  @Delete('all')
  // @CheckPoliciesAbility(new PolicyHandlerFileDelete())
  async deleteManyById(
    @Body(new ParseArrayPipe({ items: FileUpdateDto }))
    ids: FileUpdateDto[],
  ) {
    return this.fileService.deleteManyFiles(ids.map((file) => file.id));
  }

  @Get('/export-csv/:fileName')
  async export(
    @Param('fileName') fileName: string,
    @Response() res: ExpressResponse,
  ): Promise<ExpressResponse> {
    return this.fileService.getExportedUserCSV(fileName).then((csvData) => {
      res.set('Content-Type', 'text/csv');
      return res.send(csvData);
    });
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.findAll)
  findAllEvent(@Payload() query: QuerySearchAnyDto, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findAll(query);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.findOneById)
  findOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    CommonService.ack(ctx);
    return this.findOneById(id);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.createOne)
  createOneEvent(@Payload() createDto: FileCreateDto, @Ctx() ctx: RmqContext) {
    const file = this.createOne(createDto);
    CommonService.ack(ctx);
    return file;
  }
  @AllowAnon()
  @EventPattern(EventsNamesFileEnum.addDataToFile)
  async addDataToFile(@Payload() dto: FileUpdateDto, @Ctx() ctx: RmqContext) {
    try {
      await this.fileService.addDataToFile(dto);
    } catch (err) {
      Logger.error(err);
    }
    CommonService.ack(ctx);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.createMany)
  createManyEvent(
    @Payload() createsDto: FileCreateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const file = this.createMany(createsDto);
    CommonService.ack(ctx);
    return file;
  }

  @AllowAnon()
  @EventPattern(EventsNamesFileEnum.checkDownload)
  async checkDownloadEvent(
    @Payload() query: QuerySearchAnyDto,
    @Ctx() ctx: RmqContext,
  ) {
    CommonService.ack(ctx);
    query.page = query.page ?? 0;
    const files = await this.findAll(query);
    if (files.firstPage != files.nextPage) {
      await this.checkDownload({
        ...query,
        page: query.page + 1,
      });
    }
  }

  async checkDownload(query: QuerySearchAnyDto) {
    query.page = query.page ?? 0;
    const files = await this.findAll(query);
    if (files.firstPage != files.nextPage) {
      await this.checkDownload({
        ...query,
        page: query.page + 1,
      });
    }
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.updateOne)
  updateOneEvent(@Payload() updateDto: FileUpdateDto, @Ctx() ctx: RmqContext) {
    const file = this.updateOne(updateDto);
    CommonService.ack(ctx);
    return file;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.updateMany)
  updateManyEvent(
    @Payload() updatesDto: FileUpdateDto[],
    @Ctx() ctx: RmqContext,
  ) {
    const file = this.updateMany(updatesDto);
    CommonService.ack(ctx);
    return file;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.deleteMany)
  deleteManyByIdEvent(@Payload() ids: FileUpdateDto[], @Ctx() ctx: RmqContext) {
    const file = this.deleteManyById(ids);
    CommonService.ack(ctx);
    return file;
  }

  @AllowAnon()
  @MessagePattern(EventsNamesFileEnum.deleteOneById)
  deleteOneByIdEvent(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const file = this.deleteOneById(id);
    CommonService.ack(ctx);
    return file;
  }
}
