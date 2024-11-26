import { AffiliateSchema } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const affiliateProviders = [
  {
    provide: 'AFFILIATE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('affiliates', AffiliateSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
