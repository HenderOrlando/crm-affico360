import { RoleSchema } from '@role/role/entities/mongoose/role.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const roleProviders = [
  {
    provide: 'ROLE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      //connection.plugin(mongooseSlugUpdater);
      return connection.model('roles', RoleSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
