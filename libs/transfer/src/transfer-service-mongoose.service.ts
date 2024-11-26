import dbIntegrationEnum from '@builder/builders/enums/db-integration.enum';
import { CommonService } from '@common/common';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TransferCreateDto } from '@transfer/transfer/dto/transfer.create.dto';
import { TransferUpdateDto } from '@transfer/transfer/dto/transfer.update.dto';
import {
  Transfer,
  TransferDocument,
} from '@transfer/transfer/entities/mongoose/transfer.schema';
import { Model } from 'mongoose';
import { ApproveOrRejectDepositDto } from './dto/approve.or.reject.deposit.dto';

@Injectable()
export class TransferServiceMongooseService extends BasicServiceModel<
  TransferDocument,
  Model<TransferDocument>,
  TransferCreateDto,
  TransferUpdateDto
> {
  constructor(
    @Inject('TRANSFER_MODEL_MONGOOSE')
    private transferModel: Model<TransferDocument>,
  ) {
    super(transferModel);
  }

  async update(id: string, updateTransferDto: TransferUpdateDto) {
    const rta = await super.update(id, updateTransferDto);
    if (rta._id) {
      return this.updateSearchText(id);
    }
    return rta;
  }

  async updateSearchText(id: string): Promise<TransferDocument> {
    const transfer = await this.getTransferData(id);
    transfer.searchText = this.getSearchText(transfer);
    return await super.update(id, {
      searchText: transfer.searchText,
      id: transfer.id,
    });
  }

  async getTransferData(id: string): Promise<Transfer> {
    const transfers = await this.findAll({
      where: {
        _id: id,
      },
      relations: [
        'affiliate',
        'businessUnit',
        'crm',
        'lead',
        'status',
        'department',
        'bank',
        'typeTransaction',
        'pspAccount',
      ],
    });
    return transfers.list[0];
  }

  async createMany(
    createAnyDto: TransferCreateDto[],
  ): Promise<TransferDocument[]> {
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      try {
        const count = await this.count();
        for (let h = 0; h < createAnyDto.length; h++) {
          createAnyDto[h].numericId = count + h + 1;
        }
        const rta = await this.model.create(createAnyDto);
        return rta.map(
          async (transfer: TransferDocument) =>
            await this.updateSearchText(transfer.id),
        );
      } catch (err) {
        console.error(err);
      }
    }
    return this.model.save(createAnyDto);
  }

  async checkNumericId() {
    const transferUpdate: TransferUpdateDto[] = [];
    const transfers = await this.transferModel.find();
    for (let h = 0; h < transfers.length; h++) {
      transferUpdate.push({
        id: transfers[h]._id,
        numericId: h + 1,
      });
    }
    return this.updateMany(
      transferUpdate.map((transfer) => transfer.id),
      transferUpdate,
    );
  }

  async approveRejectTransfer(transfer: ApproveOrRejectDepositDto) {
    if (!transfer.id) {
      throw new BadRequestException('Id is not fined');
    }
    let rta;
    const transferDoc = await this.findOne(transfer.id.toString());
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      if (!!transferDoc.rejectedAt || !!transferDoc.approvedAt) {
        const txtRejected = !!transferDoc.rejectedAt ? ' was rejected' : '';
        const txtApproved = !!transferDoc.approvedAt ? ' was approved' : '';
        throw new BadRequestException(
          'The transfer' + txtApproved + txtRejected + ".I can't update",
        );
      }
      rta = await this.model.updateOne(
        { _id: transfer.id },
        {
          hasApproved: !!transfer.approve,
          approvedAt: transfer.approve ? new Date() : null,
          rejectedAt: transfer.approve ? null : new Date(),
        },
      );
    } else {
      rta = await this.model.update(transfer.id, transfer);
    }
    if (rta.modifiedCount) {
      transferDoc.hasApproved = transfer.approve;
      transferDoc.approvedAt = transfer.approve ? new Date() : null;
      transferDoc.rejectedAt = transfer.approve ? null : new Date();
      return transferDoc;
    }
    throw new BadRequestException('No modified transfer');
  }

  getSearchText(transfer: Transfer) {
    return (
      transfer.name +
      CommonService.getSeparatorSearchText() +
      transfer.slug +
      CommonService.getSeparatorSearchText() +
      transfer.idPayment +
      CommonService.getSeparatorSearchText() +
      transfer.numericId +
      CommonService.getSeparatorSearchText() +
      transfer.operationType +
      CommonService.getSeparatorSearchText() +
      transfer.page +
      CommonService.getSeparatorSearchText() +
      transfer.pspAccount?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.statusPayment +
      CommonService.getSeparatorSearchText() +
      transfer.country +
      CommonService.getSeparatorSearchText() +
      transfer.leadTpId +
      CommonService.getSeparatorSearchText() +
      transfer.lead?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.description +
      CommonService.getSeparatorSearchText() +
      transfer.typeTransaction?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.status?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.affiliate?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.businessUnit?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.crm?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.bank?.searchText +
      CommonService.getSeparatorSearchText() +
      transfer.department?.searchText
    );
  }
}
