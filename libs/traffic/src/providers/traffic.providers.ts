import { TrafficSchema } from '@traffic/traffic/entities/mongoose/traffic.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const trafficProviders = [
  {
    provide: 'TRAFFIC_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('traffics', TrafficSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
