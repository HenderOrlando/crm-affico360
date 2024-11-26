import { jwtConstants } from '@auth/auth/constants/auth.constant';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user';
import { CrmModule } from '@crm/crm';
import { AffiliateModule } from '@affiliate/affiliate';
import { ApiKeyStrategy } from './strategies/api.key.strategy';
import { BuildersModule } from '@builder/builders';
import { ApiKeyAffiliateStrategy } from './strategies/api.key.affiliate.strategy';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PermissionModule } from '@permission/permission';

@Module({
  imports: [
    CrmModule,
    UserModule,
    BuildersModule,
    PassportModule,
    AffiliateModule,
    PermissionModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
  ],
  providers: [
    AuthService,
    CaslAbilityFactory,
    ApiKeyAffiliateStrategy,
    ApiKeyStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, CaslAbilityFactory],
})
export class AuthModule {}
