import { CategoryEntity } from '@category/category/entities/category.entity';
import { FileInterface } from '@file/file/entities/file.interface';
import { UserEntity } from '@user/user/entities/user.entity';
import { ObjectId } from 'mongodb';

export class FileEntity implements FileInterface {
  id: ObjectId;
  name: string;
  slug: string;
  description: string;
  searchText: string;
  uri: string;
  path: string;
  mimetype: string;
  category: CategoryEntity;
  user: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
