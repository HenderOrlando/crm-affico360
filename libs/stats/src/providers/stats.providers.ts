import { StatsDateAffiliateSchema } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { StatsDatePspAccountSchema } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const statsProviders = [
  {
    provide: 'STATS_DATE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('stats_date', StatsDateAffiliateSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
  {
    provide: 'STATS_DATE_AFFILIATE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('stats_date_affiliate', StatsDateAffiliateSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
  {
    provide: 'STATS_DATE_PSP_ACCOUNT_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model(
        'stats_date_psp_account',
        StatsDatePspAccountSchema,
      );
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
