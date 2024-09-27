import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConversationRoomService } from './conversation-room.service';
import { ConversationRoomController } from './conversation-room.controller';
import { ConversationEntity } from '@model/conversation.entity';
import { RedisCacheService } from '@core/utils/caching';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
  controllers: [ConversationRoomController],
  providers: [ConversationRoomService, RedisCacheService],
})
export class ConversationRoomModule {}
