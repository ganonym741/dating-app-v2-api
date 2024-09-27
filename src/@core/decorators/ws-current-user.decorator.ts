import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Socket } from 'socket.io';

import type { UserSession } from '@core/type/session.type';

export const WsCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserSession => {
    const client: Socket = context.switchToWs().getClient<Socket>();

    return client.data.user;
  },
);
