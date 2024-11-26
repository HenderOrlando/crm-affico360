import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { FileCreateDto } from '@file/file//dto/file.create.dto';
import { FileUpdateDto } from '@file/file//dto/file.update.dto';
import { FileDocument } from '@file/file/entities/mongoose/file.schema';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { promisify } from 'util';

@Injectable()
export class FileServiceMongooseService extends BasicServiceModel<
  FileDocument,
  Model<FileDocument>,
  FileCreateDto,
  FileUpdateDto
> {
  // TODO[hender-19/10/2023] Define folderPath in environments params
  private folderPath = `storage/`;
  constructor(@Inject('FILE_MODEL_MONGOOSE') fileModel: Model<FileDocument>) {
    super(fileModel);
  }

  arrayToCSV(data: Array<any>, writeToEnd = true, onlyHeaders = false) {
    const csv = data.map((row) =>
      Object.values(row).map((item) => (item ? item['name'] ?? item : item)),
    );
    if (!writeToEnd) {
      csv.unshift(Object.keys(data[0]));
      if (onlyHeaders) {
        csv.splice(1, 1);
      }
    } else {
      csv.unshift([]);
    }
    const rta = `"${csv.join('"\n"').replace(/,/g, '","')}"`;
    //Logger.debug(rta, 'RTA');
    return rta;
  }

  async writeInFile(dto: FileUpdateDto) {
    return fs.appendFileSync(`${dto.path}`, dto.data ?? '');
  }

  // TODO[hender-24/01/2024] Not need create file in filesystem
  /* async createMany(createAnyDto: FileCreateDto[]): Promise<FileDocument[]> {
    for (const dto of createAnyDto) {
      dto.path = this.getPathFile(dto.name);
      if (!this.checkIfFileOrDirectoryExists(dto.path)) {
        await this.createFile(dto.path, '');
      }
    }
    return super.createMany(createAnyDto);
  } */

  checkIfFileOrDirectoryExists(path: string): boolean {
    return fs.existsSync(path);
  }

  async getFile(path: string, encoding: string): Promise<string | Buffer> {
    const readFile = promisify(fs.readFile);

    return encoding ? readFile(path, encoding as unknown) : readFile(path, {});
  }

  async createFile(fullPath: string, data: string): Promise<void> {
    if (!this.checkIfFileOrDirectoryExists(this.folderPath)) {
      fs.mkdirSync(this.folderPath);
    }

    return await this.writeInFile({
      path: fullPath,
      data: data,
      id: '',
    });
  }

  async deleteFile(path: string): Promise<void> {
    const unlink = promisify(fs.unlink);

    return await unlink(path);
  }

  getPathFile(fileName: string, absolute = false): string {
    if (absolute) {
      return path.join(__dirname, '/../../../', this.folderPath, fileName);
    }
    return `${this.folderPath}${fileName}`;
  }

  async getExportedUserCSV(fileName: string) {
    const filePath = this.getPathFile(fileName);
    if (!this.checkIfFileOrDirectoryExists(filePath)) {
      throw new NotFoundException('File not found.');
    }
    return (await this.getFile(filePath, 'utf8')).toString();
  }
}
