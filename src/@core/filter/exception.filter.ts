import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { Response } from 'express';
import type { Socket } from 'socket.io';

@Catch(HttpException)
export class ExceptionFilters implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorInstanceStatus =
      exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(errorInstanceStatus).json({
      status_code: errorInstanceStatus,
      status_description: exception.getResponse()['message'],
    });
  }
}

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    client.emit('exception', {
      status_code: 'error',
      status_description: exception.getError(),
    });
  }
}

