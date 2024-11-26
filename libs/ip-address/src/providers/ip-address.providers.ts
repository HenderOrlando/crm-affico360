import { IpAddressSchema } from '@ip-address/ip-address/entities/mongoose/ip-address.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const ipAddressProviders = [
  {
    provide: 'IP_ADDRESS_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('ip_addresses', IpAddressSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
