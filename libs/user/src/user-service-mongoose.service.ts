import { UserChangePasswordDto } from '@user/user/dto/user.change-password.dto';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import dbIntegrationEnum from '@builder/builders/enums/db-integration.enum';
import { UserDocument } from '@user/user/entities/mongoose/user.schema';
import { UserRegisterDto } from '@user/user/dto/user.register.dto';
import { UserUpdateDto } from '@user/user/dto/user.update.dto';
import { CommonService } from '@common/common/common.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { Model } from 'mongoose';
import { RoleDocument } from '@role/role/entities/mongoose/role.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserServiceMongooseService extends BasicServiceModel<
  UserDocument,
  Model<UserDocument>,
  UserRegisterDto,
  UserUpdateDto
> {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ROLE_MODEL_MONGOOSE')
    private readonly roleModel: Model<RoleDocument>,
    @Inject('USER_MODEL_MONGOOSE') userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async update(id: string, updateAnyDto: UserUpdateDto): Promise<UserDocument> {
    if (!('active' in updateAnyDto)) {
      const user = await this.findOne(id);
      updateAnyDto.active = user.active;
    }
    return super.update(id, updateAnyDto);
  }

  async createMany(createAnyDto: UserRegisterDto[]): Promise<UserDocument[]> {
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      for (const user of createAnyDto) {
        user.apiKey = CommonService.getHash(CommonService.generatePassword(4));
        user.password = user.password ?? CommonService.generatePassword();
        user.password = CommonService.getHash(user.password, 3);
        if (user.role) {
          const role = await this.roleModel.findById(user.role);
          if (!role) {
            throw new NotFoundException('Role not found');
          }
          user.permissions = role.permissions;
          user.authorizations = role.codes;
        }
        user.active = true;
        const appName =
          this.configService.get<string>('APP_NAME') ?? 'Affico360';
        const speakeasySecretParameters = speakeasy.generateSecret({
          name: appName + ' - ' + user.email,
        });
        const qrCodeUrlImg = await qrcode.toDataURL(
          speakeasySecretParameters?.otpauth_url,
        );
        user.twoFactorQr = qrCodeUrlImg;
        user.twoFactorSecret = speakeasySecretParameters?.base32;
        user.twoFactorIsActive = false;
      }
      return this.model.create(createAnyDto);
    }
    return this.model.save(createAnyDto);
  }

  async changePassword(id: string, dto: UserChangePasswordDto) {
    dto = this.model.setPassword(dto);
    return this.update(id, dto as any);
  }
}
