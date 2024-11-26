import Strategy from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(authService: AuthService) {
    super(
      {
        header: 'affico-360-key',
        prefix: '',
      },
      true,
      async (apiKey, done) => {
        const user = await authService.getUserByApiKey(apiKey);
        const exception = !user ? new UnauthorizedException() : null;
        done(exception, !user ? null : user);
      },
    );
  }
}
