import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';
import { ObjectId } from 'mongoose';

export class TransferLeadStatsDto {
  transfer: ObjectId;
  amount: number;
  currency: string;
  operationType: OperationTransactionType;
  sourceType: ObjectId;
  lead: ObjectId;
  affiliate: ObjectId;
  status: ObjectId;
  department: ObjectId;
  typeTransaction: ObjectId;
  psp: ObjectId;
  pspAccount: ObjectId;
  crm: ObjectId;
  brand: ObjectId;
  transferDateCreated: Date;
  transferDateApproved: Date;
  leadStatus: ObjectId;
  leadShowToAffiliate: boolean;
  leadDateCreated: Date;
  leadDateCftd: Date;
  leadDateFtd: Date;
}
