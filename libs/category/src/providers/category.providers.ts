import { CategorySchema } from '@category/category/entities/mongoose/category.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const categoryProviders = [
  {
    provide: 'CATEGORY_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('categories', CategorySchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
