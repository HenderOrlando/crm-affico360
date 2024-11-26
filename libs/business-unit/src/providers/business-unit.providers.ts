import { BusinessUnitSchema } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const businessUnitProviders = [
  {
    provide: 'BUSINESS_UNIT_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('business_units', BusinessUnitSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
