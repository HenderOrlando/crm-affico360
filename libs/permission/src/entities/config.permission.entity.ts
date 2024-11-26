import { Prop } from '@nestjs/mongoose';

export class ConfigPermissionEntity {
  @Prop()
  tableHidden: Array<string>;
  @Prop()
  cardHidden: Array<string>;
}
