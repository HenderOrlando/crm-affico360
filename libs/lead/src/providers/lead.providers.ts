import { LeadSchema } from '@lead/lead/entities/mongoose/lead.schema';
import { LeadPspSchema } from '../entities/mongoose/lead-psp.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const leadProviders = [
  {
    provide: 'LEAD_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('leads', LeadSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
  {
    provide: 'LEAD_PSP_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('lead_psp', LeadPspSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
