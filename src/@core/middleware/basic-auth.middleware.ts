import type { NestMiddleware } from '@nestjs/common';
import basicAuth from 'express-basic-auth';

export class BasicAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    basicAuth({
      users: { 'admin': 'supersecret' },
      challenge: true,
    })(req, res, next);
  }
}
