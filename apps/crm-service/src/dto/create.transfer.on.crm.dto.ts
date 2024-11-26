import { LeadInterface } from '@lead/lead/entities/lead.interface';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';

export interface CreateTransferOnCrmDto {
  lead: LeadInterface;
  transfer: TransferInterface;
  operationType: OperationTransactionType.noApply;
}
