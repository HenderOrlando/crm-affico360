import { PersonSchema } from '@person/person/entities/mongoose/person.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const personProviders = [
  {
    provide: 'PERSON_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('persons', PersonSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
