import { UserSchema } from '@user/user/entities/mongoose/user.schema';
import { Connection } from 'mongoose';

export const userProviders = [
  {
    provide: 'USER_MODEL_MONGOOSE',
    useFactory: (connection: Connection) =>
      connection.model('users', UserSchema),
    inject: ['MONGOOSE_CONNECTION'],
  },
];
