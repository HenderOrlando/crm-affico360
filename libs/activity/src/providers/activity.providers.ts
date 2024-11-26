import { ActivitySchema } from '@activity/activity/entities/mongoose/activity.schema';
import { databaseProviders } from '@common/common/database-providers/database-providers.service';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const activityProviders = [
  ...databaseProviders,
  {
    provide: 'ACTIVITY_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('activities', ActivitySchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
