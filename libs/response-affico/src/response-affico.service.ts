import ActionsEnum from '@common/common/enums/ActionEnum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ResponseAffico from './models/ResponseAffico';

@Injectable()
export class ResponseAfficoService {
  constructor(private readonly config: ConfigService) {}

  getErrorResponse(err: any, action?: ActionsEnum): BadRequestException {
    return new ResponseAffico(
      this.config.get('ENVIRONMENT'),
      err,
      action,
    ).getErrorResponse();
  }

  getResponse(
    rta: any,
    action?: ActionsEnum,
    message?: string,
    description?: string,
  ): any {
    return new ResponseAffico(
      this.config.get('ENVIRONMENT'),
      rta,
      action,
    ).getResponse(message, description);
  }
}
