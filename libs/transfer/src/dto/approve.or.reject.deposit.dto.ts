import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsMongoId, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class ApproveOrRejectDepositDto extends CreateAnyDto {
  @IsMongoId()
  @IsNotEmpty()
  id: ObjectId;

  @IsBoolean()
  @IsOptional()
  approve?: boolean;

  @IsBoolean()
  @IsOptional()
  userApprover?: ObjectId;

  @IsBoolean()
  @IsOptional()
  userRejecter?: ObjectId;
}
