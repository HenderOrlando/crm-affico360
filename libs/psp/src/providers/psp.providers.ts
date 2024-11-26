import { PspSchema } from '@psp/psp/entities/mongoose/psp.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const pspProviders = [
  {
    provide: 'PSP_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('psps', PspSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
