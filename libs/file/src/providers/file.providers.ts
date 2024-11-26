import { FileSchema } from '@file/file/entities/mongoose/file.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const fileProviders = [
  {
    provide: 'FILE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('files', FileSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
