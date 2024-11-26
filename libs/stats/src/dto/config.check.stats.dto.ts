import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';
import CheckStatsType from '@stats/stats/enum/check.stats.type';

export class ConfigCheckStatsDto {
  @IsOptional()
  @IsEnum(CheckStatsType)
  checkType: CheckStatsType = CheckStatsType.ALL;

  @IsOptional()
  @IsMongoId()
  affiliateId?: ObjectId;

  @IsOptional()
  @IsMongoId()
  pspAccountId?: ObjectId;
}
