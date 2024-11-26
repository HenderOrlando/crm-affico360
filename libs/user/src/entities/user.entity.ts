import { AffiliateEntity } from '@affiliate/affiliate/domain/entities/affiliate.entity';
import { CategoryEntity } from '@category/category/entities/category.entity';
import { CommonService } from '@common/common';
import { FileEntity } from '@file/file/entities/file.entity';
import { PermissionEntity } from '@permission/permission/entities/permission.entity';
import { PersonEntity } from '@person/person/entities/person.entity';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { RoleEntity } from '@role/role/entities/role.entity';
import { UserChangePasswordDto } from '@user/user/dto/user.change-password.dto';
import { UserInterface } from '@user/user/entities/user.interface';
import { ObjectId } from 'mongoose';

export class UserEntity implements UserInterface {
  _id?: ObjectId;
  id: ObjectId;
  email: string;
  slugEmail: string;
  searchText: string;
  name: string;
  slug: string;
  description: string;
  username: string;
  slugUsername: string;
  password: string;
  confirmPassword?: string;
  active: boolean;
  isClientAPI: boolean;
  apiKey: string;
  configuration: JSON;
  twoFactorSecret: string;
  twoFactorQr: string;
  twoFactorIsActive: boolean;
  image: FileEntity;
  role: RoleEntity;
  permissions: Array<PermissionEntity>;
  authorizations: Array<string>;
  category: CategoryEntity;
  personalData: PersonEntity;
  userParent: UserEntity;
  createdAt: Date;
  updatedAt: Date;

  setPassword(dto: UserChangePasswordDto, generatePassword = false) {
    let { password, confirmPassword } = dto as any;
    if (
      generatePassword &&
      password == undefined &&
      password === confirmPassword
    ) {
      password = confirmPassword = CommonService.generatePassword();
    }
    if (
      password !== confirmPassword ||
      (password == undefined && password === confirmPassword)
    ) {
      throw ResponseAffico.getResponseSwagger(400);
    }
    dto['password'] = CommonService.getHash(password);
    dto['confirmPassword'] = '';
    return dto;
  }

  static changePassword(dto: any, generatePassword = false) {
    let { password, confirmPassword } = dto;
    if (
      generatePassword &&
      password == undefined &&
      password === confirmPassword
    ) {
      password = confirmPassword = CommonService.generatePassword();
    }
    if (
      password !== confirmPassword ||
      (password == undefined && password === confirmPassword)
    ) {
      throw ResponseAffico.getResponseSwagger(400);
    }
    dto['password'] = CommonService.getHash(password);
    dto['confirmPassword'] = '';
    return dto;
  }
}
