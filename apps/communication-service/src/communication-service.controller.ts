import { Controller, Get } from '@nestjs/common';
import { CommunicationServiceService } from './communication-service.service';

@Controller()
export class CommunicationServiceController {
  constructor(
    private readonly communicationServiceService: CommunicationServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.communicationServiceService.getHello();
  }
}
