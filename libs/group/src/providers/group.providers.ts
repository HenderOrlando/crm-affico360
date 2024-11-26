import { GroupSchema } from '@group/group/entities/mongoose/group.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const groupProviders = [
  {
    provide: 'GROUP_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('groups', GroupSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
