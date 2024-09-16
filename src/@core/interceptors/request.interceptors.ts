import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { CryptService } from '@core/utils/encryption';

const IgnoredPropertyName = Symbol('IgnoredPropertyName');

export function SkipInterceptor() {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    descriptor.value[IgnoredPropertyName] = true;
  };
}

@Injectable()
export class RequestInterceptor<T> implements NestInterceptor<T> {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const isIgnoreInterceptor = context.getHandler()[IgnoredPropertyName];

    if (isIgnoreInterceptor) {
      return next.handle(); // Skip decryption if decorator is used on the specific API endpoint
    }

    request.body = JSON.parse(CryptService.decrypt(request.body?.payload));

    return next.handle();
  }
}
