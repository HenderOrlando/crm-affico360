import { StatusSchema } from '@status/status/entities/mongoose/status.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const statusProviders = [
  {
    provide: 'STATUS_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('statuses', StatusSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
