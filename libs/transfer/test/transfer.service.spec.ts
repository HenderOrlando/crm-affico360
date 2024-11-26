import { TransferServiceMongooseService } from '@transfer/transfer/transfer-service-mongoose.service';
import { TransferDocument } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { TransferCreateDto } from '@transfer/transfer/dto/transfer.create.dto';
import { TransferUpdateDto } from '@transfer/transfer/dto/transfer.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import CurrencyCodeAfficoEnum from '@common/common/enums/currency-code-affico.enum';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import { transferProviders } from '@transfer/transfer/providers/transfer.providers';

describe('TransferService', () => {
  let service: TransferServiceMongooseService;
  let transfer: TransferDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferServiceMongooseService, ...transferProviders],
    }).compile();

    service = module.get<TransferServiceMongooseService>(
      TransferServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const transferDto: TransferCreateDto = {
      name: '',
      description: '',
      searchText: '',
      currency: CurrencyCodeAfficoEnum.USD,
      numericId: 0,
      operationType: OperationTransactionType.noApply,
      amount: 0,
      lead: undefined,
      leadEmail: '',
      leadTpId: '',
      leadAccountId: '',
      leadCrmName: '',
      leadName: '',
      leadTradingPlatformId: '',
      crmTransactionId: '',
      leadCountry: CountryCodeEnum.na,
      pspAccount: undefined,
      typeTransaction: undefined,
      page: '',
      idPayment: '',
      statusPayment: '',
      descriptionStatusPayment: '',
      urlPayment: '',
      hasApproved: false,
      status: undefined,
      affiliate: undefined,
      department: undefined,
      psp: undefined,
      bank: undefined,
      businessUnit: undefined,
      crm: undefined,
      confirmedAt: undefined,
      approvedAt: undefined,
      rejectedAt: undefined,
      isManualTx: false,
    };
    expect(
      service.create(transferDto).then((createdTransfer) => {
        transfer = createdTransfer;
      }),
    ).toHaveProperty('name', transfer.name);
  });

  it('should be update', () => {
    const transferDto: TransferUpdateDto = {
      id: transfer.id,
      name: 'colombia',
      description: '987654321',
    };
    expect(
      service.update(transferDto.id, transferDto).then((updatedTransfer) => {
        transfer = updatedTransfer;
      }),
    ).toHaveProperty('name', transferDto.name);
  });

  it('should be update', () => {
    expect(service.remove(transfer.id)).toReturn();
  }); */
});
