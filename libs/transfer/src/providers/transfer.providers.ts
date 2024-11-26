import { TransferSchema } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const transferProviders = [
  {
    provide: 'TRANSFER_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('transfers', TransferSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
