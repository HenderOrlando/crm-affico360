import { PermissionSchema } from '@permission/permission/entities/mongoose/permission.schema';
import { ScopeSchema } from '@permission/permission/entities/mongoose/scope.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const permissionProviders = [
  {
    provide: 'PERMISSION_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('permissions', PermissionSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
  {
    provide: 'SCOPE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('scopes', ScopeSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
