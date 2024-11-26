import Strategy from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyAffiliateStrategy extends PassportStrategy(
  Strategy,
  'api-key-affiliate',
) {
  constructor(authService: AuthService) {
    super(
      {
        header: 'affico-360-affiliate-key',
        prefix: '',
      },
      true,
      async (apiKey, done) => {
        const affiliate = await authService.getAffiliateByPublicKey(apiKey);
        const exception = !affiliate ? new UnauthorizedException() : null;
        done(exception, affiliate);
      },
    );
  }
}
