import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { ApiProperty } from '@nestjs/swagger';
import { OperationTransactionType } from '@transfer/transfer/enum/operation.transaction.type.enum';

export class StatsLeadResponseDto {
  constructor(lead: LeadDocument) {
    this.totalDeposit = 0;
    this.totalWithdrawal = 0;
    this.total_credits = 0;
    this.total_pending_withdrawal = 0;
    this.total_positions = 0;
    this.id = lead.crmIdLead;
    for (const transfer of lead.transfers) {
      if (transfer.operationType === OperationTransactionType.deposit) {
        this.totalDeposit += transfer.amount;
      } else if (
        transfer.operationType === OperationTransactionType.withdrawal
      ) {
        if (
          transfer.statusPayment === '' ||
          transfer.statusPayment.toLowerCase() === 'pending'
        ) {
          this.total_pending_withdrawal += transfer.amount;
        }
        this.totalWithdrawal += transfer.amount;
      }
    }
  }

  @ApiProperty({
    type: String,
    description: 'Id lead',
  })
  id: string;

  @ApiProperty({
    type: Number,
    description: 'Total deposits',
  })
  totalDeposit: 0;

  @ApiProperty({
    type: Number,
    description: 'Total withdrawal confirmed',
  })
  totalWithdrawal: 0;

  @ApiProperty({
    type: Number,
    description: 'Total credits',
  })
  total_credits: 0;

  @ApiProperty({
    type: Number,
    description: 'Total withdrawal pending',
  })
  total_pending_withdrawal: 0;

  @ApiProperty({
    type: Number,
    description: 'Total position',
  })
  total_positions: 0;
}
