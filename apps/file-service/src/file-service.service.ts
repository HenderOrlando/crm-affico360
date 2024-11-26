import { isString } from 'class-validator';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { FileServiceMongooseService } from '@file/file';
import { FileCreateDto } from '@file/file/dto/file.create.dto';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class FileServiceService {
  constructor(
    @Inject(FileServiceMongooseService)
    private lib: FileServiceMongooseService,
  ) {
    XLSX.set_fs(fs);
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newFile(file: FileCreateDto) {
    const file_ = await this.getAll({
      where: {
        name: file.name,
        path: file.path,
      },
    });
    return file_.totalElements > 0 ? file_.list[0] : this.lib.create(file);
  }

  async newManyFile(createFilesDto: FileCreateDto[]) {
    return this.lib.createMany(createFilesDto);
  }

  async updateFile(file: FileUpdateDto) {
    return this.lib.update(file.id, file);
  }

  async updateManyFiles(files: FileUpdateDto[]) {
    return this.lib.updateMany(
      files.map((file) => file.id),
      files,
    );
  }

  async deleteFile(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyFiles(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async getExportedUserCSV(fileName: string) {
    return this.lib.getExportedUserCSV(fileName);
  }
  async addDataToFile(dto: FileUpdateDto) {
    const files = await this.getAll({
      where: {
        name: dto.name,
      },
    });
    let file = files.list[0];
    if (!file) {
      file = await this.newFile(dto as FileCreateDto);
    }
    if (dto.mimetype.indexOf('csv')) {
      //
      dto.data = this.lib.arrayToCSV(
        [JSON.parse(dto.data)],
        !dto.isFirst,
        dto.onlyHeaders,
      );
    }
    dto.path = this.lib.getPathFile(dto.name);
    //
    return this.lib.writeInFile(dto);
  }
}
