import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
