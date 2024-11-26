import { StatsDateAffiliateDocument } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { StatsDatePspAccountDocument } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { StatsDateAffiliateServiceMongooseService } from '@stats/stats/stats.date.affiliate.service.mongoose.service';
import { StatsDatePspAccountServiceMongooseService } from '@stats/stats/stats.date.psp.account.service.mongoose.service';

export type StatsDateDocuments =
  | StatsDateAffiliateDocument
  | StatsDatePspAccountDocument;

export type StatsDateMongoose =
  | StatsDateAffiliateServiceMongooseService
  | StatsDatePspAccountServiceMongooseService;

export type CheckStatsDateResponse = Promise<
  Array<StatsDateAffiliateDocument> | Array<StatsDatePspAccountDocument>
>;
