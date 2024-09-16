import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

import { CryptService } from '../utils/encryption';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  use(req: Request, res: Response, next: Function) {
    const originalWrite = res.json.bind(res);

    res.json = (body: any) => {
      if (res.statusCode < 400) {
        body = {
          status_code: body.status_code ?? 200,
          status_description: body.status_description ?? 'Request Success',
          data: body.data
            ? CryptService.encrypt(JSON.stringify(body.data))
            : body?.status_code || body?.status_description
              ? null
              : CryptService.encrypt(JSON.stringify(body.data)),
          ...(body.meta ? { meta: body.meta } : {}),
        };
      }

      return originalWrite(body);
    };

    next();
  }
}
