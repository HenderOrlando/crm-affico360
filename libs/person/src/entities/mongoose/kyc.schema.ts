import KyCModel from '@common/common/models/KyCModel';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class KyCSchema implements KyCModel {
  @Prop()
  hashPhoto: string;

  @Prop()
  hashDocument: string;

  @Prop()
  hashDocumentData: string;
}
