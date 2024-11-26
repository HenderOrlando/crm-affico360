import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ResponseAfficoService } from '@response-affico/response-affico';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import { Response } from 'express';

@Catch()
export class ResponseHttpExceptionFilter implements ExceptionFilter {
  constructor(private responseAffico: ResponseAfficoService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();
    const rta = new ResponseAffico(
      process.env.ENVIRONMENT || 'DEV',
      exception.response || exception,
    ).getResponse();
    if (ctx['contextType'] == 'rpc') {
      ctx.getNext();
    } else {
      //rta.data = rta.data ?? {};
      //rta.data.message = rta.description ?? rta.data?.message;
      response
        .status(this.getStatus(rta, exception))
        .json(rta.data?.description ? rta.data : rta);
    }
  }

  private getStatus(rta, exception) {
    return typeof rta?.statusCode === 'string'
      ? exception.status
      : rta?.statusCode ?? 500;
  }
}
