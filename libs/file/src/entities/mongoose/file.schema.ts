import { Category } from '@category/category/entities/mongoose/category.schema';
import { FileEntity } from '@file/file/entities/file.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/user/entities/mongoose/user.schema';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type FileDocument = File & Document;

@Schema({
  timestamps: true,
})
export class File extends FileEntity {
  id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  searchText: string;

  @Prop()
  uri: string;

  @Prop()
  path: string;

  @Prop()
  mimetype: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: User;
}

export const FileSchema = SchemaFactory.createForClass(File);
