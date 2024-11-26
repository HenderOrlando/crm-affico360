import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunicationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
