import { PspAccountSchema } from '@psp-account/psp-account/entities/mongoose/psp-account.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const PspAccountProviders = [
  {
    provide: 'PSP_ACCOUNT_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('psp_accounts', PspAccountSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
