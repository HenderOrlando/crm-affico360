import { CrmSchema } from '@crm/crm/entities/mongoose/crm.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const crmProviders = [
  {
    provide: 'CRM_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('crms', CrmSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
