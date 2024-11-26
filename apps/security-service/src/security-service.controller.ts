import { SecurityServiceService } from './security-service.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class SecurityServiceController {
  constructor(
    private readonly securityServiceService: SecurityServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.securityServiceService.getHello();
  }
}
