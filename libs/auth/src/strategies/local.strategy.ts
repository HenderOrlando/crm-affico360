import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, configService: ConfigService) {
    super(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        let data;
        if (req.body.apiKey) {
          data = await this.authService.decodeToken(req.body.apiKey);
          // TODO[hender] Validate if data has expired
        }
        const crmId = await this.getCrm(req.body.crmId);
        const user = await this.validate(username, password);
        if (user.message) {
          return done(user);
        }
        const affiliatesList = user.personalData?.affiliates;
        let affiliates;
        if (affiliatesList) {
          affiliates = await this.authService.getAffiliates(
            affiliatesList,
            crmId,
          );
        }
        user.apiData = data;
        user.affiliate =
          affiliates?.list?.length > 0 ? affiliates?.list[0] : null;
        if (configService.get<string>('GOOGLE_2FA') === 'true') {
          if (req.body.code) {
            // Validate code if 2Factor is'n active
            const isValid = await this.authService.verifyTwoFactor(
              user.twoFactorSecret,
              req.body.code,
            );
            if (!isValid) {
              return done(new BadRequestException('Code is not valid'));
            }
          } else if (user.twoFactorIsActive) {
            // TODO[hender - 2024/02/19] Commented if 2Factor is not needed
            return done(new BadRequestException('I need the Code'));
          }
        }
        done(null, this.authService.getPayload(user));
      },
    );
  }

  public async getCrm(crmId: string) {
    return await this.authService.getCrm(crmId);
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.getUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
