import { PspAccountServiceMongooseService } from '@psp-account/psp-account/psp-account-service-mongoose.service';
import { PspAccountDocument } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { PspAccountCreateDto } from '@psp-account/psp-account/dto/psp-account.create.dto';
import { PspAccountUpdateDto } from '@psp-account/psp-account/dto/psp-account.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';

describe('PspAccountService', () => {
  let service: PspAccountServiceMongooseService;
  let pspaccount: PspAccountDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PspAccountServiceMongooseService],
    }).compile();

    service = module.get<PspAccountServiceMongooseService>(
      PspAccountServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const pspaccountDto: PspAccountCreateDto = {
      name: 'pspaccount between users',
      description: '',
      category: {
        id: new ObjectId('id_category'),
      },
      creator: {
        id: new ObjectId('id_user'),
      },
      status: {
        id: new ObjectId('id_category'),
      },
      psp: undefined,
      apiKey: '',
      username: '',
      password: '',
      idCashier: '',
    };
    expect(
      service.create(pspaccountDto).then((createdPspAccount) => {
        pspaccount = createdPspAccount;
      }),
    ).toHaveProperty('id', pspaccount.id);
  });

  it('should be update', () => {
    const pspaccountDto: PspAccountUpdateDto = {
      id: pspaccount.id,
      name: 'pspaccount',
    };
    expect(
      service
        .update(pspaccountDto.id.toString(), pspaccountDto)
        .then((updatedPspAccount) => {
          pspaccount = updatedPspAccount;
        }),
    ).toHaveProperty('name', pspaccountDto.name);
  });

  it('should be update', () => {
    expect(service.remove(pspaccount.id)).toReturn();
  }); */
});
