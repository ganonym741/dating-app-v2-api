import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { SocketGateway } from './socket.gateway';
import { ChatEntity } from '@model/chat.entity';
import { UserEntity } from '@model/user.entity';
import { ConversationEntity } from '@model/conversation.entity';
import { ChatService } from './service/chat.service';
import { UserService } from '@/user/user.service';
import { RedisCacheService } from '@core/utils/caching';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, ChatEntity, UserEntity]),
  ],
  providers: [SocketGateway, JwtService, ChatService, UserService, RedisCacheService],
})
export class SocketModule {}
