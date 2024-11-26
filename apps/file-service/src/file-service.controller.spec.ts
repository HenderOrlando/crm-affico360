import { FileServiceController } from './file-service.controller';
import { FileCreateDto } from '@file/file/dto/file.create.dto';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { FileServiceService } from './file-service.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileServiceController', () => {
  let file;
  let fileServiceController: FileServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileServiceController],
      providers: [FileServiceService],
    }).compile();

    fileServiceController = app.get<FileServiceController>(
      FileServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const fileDto: FileCreateDto = {
        name: 'mexico',
        description: '',
        path: '',
        mimetype: '',
        user: '',
        category: null,
      };
      expect(
        fileServiceController.createOne(fileDto).then((createdFile) => {
          file = createdFile;
        }),
      ).toHaveProperty('filename', file.filename);
    });

    it('should be update', () => {
      const fileDto: FileUpdateDto = {
        id: file.id,
        filename: 'colombia',
        password: '987654321',
      };
      expect(
        fileServiceController.updateOne(fileDto).then((updatedFile) => {
          file = updatedFile;
        }),
      ).toHaveProperty('filename', fileDto.filename);
    });

    it('should be delete', () => {
      expect(fileServiceController.deleteOneById(file.id)).toReturn();
    });
  });
});
