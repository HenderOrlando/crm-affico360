import { ResponseHttpExceptionFilter } from '@common/common/exceptions/response.exception';
import { ResponseInterceptor } from '@common/common/interceptors/response.interceptor';
import { IProvider } from '@common/common/interfaces/i.provider.interface';
import { CacheInterceptor } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

export const moduleProvidersConfig = [
  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: ResponseHttpExceptionFilter,
  },
] as IProvider[];
