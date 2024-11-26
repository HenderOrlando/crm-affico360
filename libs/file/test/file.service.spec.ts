import { FileServiceMongooseService } from '@file/file/file-service-mongoose.service';
import { FileDocument } from '@file/file/entities/mongoose/file.schema';
import { FileCreateDto } from '@file/file/dto/file.create.dto';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileService', () => {
  let service: FileServiceMongooseService;
  let file: FileDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileServiceMongooseService],
    }).compile();

    service = module.get<FileServiceMongooseService>(
      FileServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const fileDto: FileCreateDto = {
      name: 'mexico',
      description: '123456',
      path: '',
      mimetype: '',
      category: null,
      user: '',
    };
    expect(
      service.create(fileDto).then((createdFile) => {
        file = createdFile;
      }),
    ).toHaveProperty('name', file.name);
  });

  it('should be update', () => {
    const fileDto: FileUpdateDto = {
      id: file.id,
      name: 'colombia',
      description: '987654321',
      data: '',
    };
    expect(
      service.update(fileDto.id, fileDto).then((updatedFile) => {
        file = updatedFile;
      }),
    ).toHaveProperty('name', fileDto.name);
  });

  it('should be update', () => {
    expect(service.remove(file.id)).toReturn();
  }); */
});
