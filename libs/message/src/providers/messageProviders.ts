import { MessageSchema } from '@message/message/entities/mongoose/message.schema';
import { Connection } from 'mongoose';
import * as mongooseSlugUpdater from 'mongoose-slug-updater';

export const MessageProviders = [
  {
    provide: 'MESSAGE_MODEL_MONGOOSE',
    useFactory: (connection: Connection) => {
      connection.plugin(mongooseSlugUpdater);
      return connection.model('messages', MessageSchema);
    },
    inject: ['MONGOOSE_CONNECTION'],
  },
];
