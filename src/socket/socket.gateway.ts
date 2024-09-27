/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from '@nestjs/event-emitter';

import { ChatService } from '@/socket/service/chat.service';
import { WsExceptionFilter } from '@core/filter/exception.filter';
import { UserSession } from '@core/type/session.type';
import { UserService } from '@/user/user.service';
import { configService } from '@core/config/config.service';
import { WsCurrentUser } from '@core/decorators/ws-current-user.decorator';
import { WsValidationPipe } from '@core/pipe/ws-validation.pipe';
import {
  CreateNewChatDto,
  DeleteChatDto,
  EditChatDto,
  GetConversationChatDto,
} from './dto/chat.dto';
import { ConversationEntity } from '@model/conversation.entity';

@UseFilters(WsExceptionFilter)
@WebSocketGateway(4800, { cors: { origin: '*' } })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Server;
  private readonly logger = new Logger(SocketGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(socket: Socket) {
    try {
      const user = this.authenticateSocket(socket);

      await this.initializeUserConnection(user, socket);
    } catch (error: any) {
      this.handleConnectionError(socket, error);
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const user = this.authenticateSocket(socket);

      await this.userService.update(user._id, { is_online: false });

      this.logger.log(`Client id:${user._id} disconnected`);
    } catch (error: any) {
      this.handleConnectionError(socket, error);
    }
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @WsCurrentUser() currentUser: UserSession,
    @MessageBody(new WsValidationPipe()) createChatDto: CreateNewChatDto
  ): Promise<void> {
    const userId = currentUser._id;

    try {
      const newMessage = await this.chatService.create(userId, createChatDto);

      this.io
        .to(`conversation-${createChatDto.conversationId}`)
        .emit(`conversation-${createChatDto.conversationId}`, {
          data: newMessage,
          action: 'get',
        });
    } catch (error: any) {
      this.logger.error(
        `Gagal mengirim pesan. User ID: ${userId}. Error: ${error.message}`,
        error.stack
      );
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('getMessages')
  async onFindAllMessages(
    @WsCurrentUser() currentUser: UserSession,
    @MessageBody(new WsValidationPipe())
    getConversationChatDto: GetConversationChatDto
  ): Promise<void> {
    const userId = currentUser._id;

    try {
      const messages = await this.chatService.getMessages(
        userId,
        getConversationChatDto
      );

      this.io
        .to(`conversation-${getConversationChatDto.conversationId}`)
        .emit(`conversation-${getConversationChatDto.conversationId}`, {
          data: messages,
          action: 'get',
        });
    } catch (error: any) {
      this.logger.error(
        `Gagal mengambil pesan. Conversation ID ${getConversationChatDto.conversationId} oleh User ID ${userId}: ${error.message}`,
        error.stack
      );
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('updateMessage')
  async onUpdateMessage(
    @WsCurrentUser() currentUser: UserSession,
    @MessageBody(new WsValidationPipe()) updateChatDto: EditChatDto
  ): Promise<void> {
    const userId = currentUser._id;

    try {
      const updatedMessage = await this.chatService.update(
        userId,
        updateChatDto
      );

      this.io
        .to(`conversation-${updateChatDto.conversationId}`)
        .emit(`conversation-${updateChatDto.conversationId}`, {
          data: updatedMessage,
          action: 'edit',
        });
    } catch (error: any) {
      this.logger.error(
        `Gagal update pesan. message ID ${updateChatDto.messageId} by User ID ${userId}: ${error.message}`,
        error.stack
      );

      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('deleteMessage')
  async onDeleteMessage(
    @WsCurrentUser() currentUser: UserSession,
    @MessageBody(new WsValidationPipe()) deleteChatDto: DeleteChatDto
  ): Promise<void> {
    const userId = currentUser._id;

    try {
      const deletedMessage = await this.chatService.delete(
        userId,
        deleteChatDto
      );

      this.io
        .to(`conversation-${deleteChatDto.conversationId}`)
        .emit(`conversation-${deleteChatDto.conversationId}`, {
          data: deletedMessage,
          action: 'delete',
        });
    } catch (error: any) {
      this.logger.error(
        `Gagal menghapus pesan. message ID ${deleteChatDto.messageId} by User ID ${userId}: ${error.message}`,
        error.stack
      );

      throw new WsException(error.message);
    }
  }

  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: ConversationEntity) {
    const { participants } = payload;
    const recipientSocket = this.io.sockets.sockets;

    recipientSocket.forEach((client) => {
      const user: UserSession | undefined = client.data.user;

      if (user && participants.includes(user._id.toString())) {
        client.emit('onConversation', payload);
      }
    });
  }

  private authenticateSocket(socket: Socket): UserSession {
    const token = this.extractJwtToken(socket);

    return this.jwtService.verify<UserSession>(token, {
      secret: configService.getJWTConfig().secret,
    });
  }

  private async initializeUserConnection(
    UserSession: UserSession,
    socket: Socket
  ): Promise<void> {
    socket.data.user = UserSession;
    await this.userService.update(UserSession._id, { is_online: true });

    this.logger.log(
      `Client connected: ${socket.id} - User ID: ${UserSession._id}`
    );
  }

  private handleConnectionError(socket: Socket, error: Error): void {
    this.logger.error(
      `Koneksi Error. socket ${socket.id}: ${error.message}`
    );
    socket.emit('exception', 'Authentication error');
    socket.disconnect();
  }

  private extractJwtToken(socket: Socket): string {
    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('No authorization header found');

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid or missing token');

    return token;
  }
}
