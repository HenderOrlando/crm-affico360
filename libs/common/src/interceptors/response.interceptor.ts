import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResponseAfficoService } from '@response-affico/response-affico';
import { catchError, map, Observable, throwError } from 'rxjs';
import { isArray, isNumber, isString } from 'class-validator';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private responseAffico: ResponseAfficoService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const [req, res] = context.getArgs();
    // req.ip
    // req.ips
    // req.method
    // req.originalUrl
    // req.route
    // res.statusCode

    return next.handle().pipe(
      map((data) => {
        if (context['contextType'] === 'rpc') {
          return data;
        }
        if (!!data) {
          data.statusCode = this.getStatusCode(data, res);
          if (isString(data.status)) {
            delete data.status;
          }
        }
        res.status(data?.statusCode ?? 500);
        return this.responseAffico.getResponse(data);
      }),
      catchError(this.catchError(context['contextType'])),
    );
  }

  private getStatusCode(data, res) {
    return (
      data?.statusCode ??
      (data.access_token || data.id || isArray(data.list) || isArray(data)
        ? 201
        : !!data.response
        ? data.response?.statusCode
        : isNumber(res.status)
        ? res.status
        : 400)
    );
  }

  private catchError(contextType: string) {
    return (err) => {
      return throwError(() => {
        if (contextType === 'rpc') {
          return new RpcException(err);
        }
        return new BadGatewayException(err);
      });
    };
  }
}
