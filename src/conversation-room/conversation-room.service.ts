import { Injectable } from '@nestjs/common';
import type { ObjectId, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import type { CreateConversationRoomDto } from './dto/create-conversation-room.dto';
import { ConversationEntity } from '@model/conversation.entity';

@Injectable()
export class ConversationRoomService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepo: Repository<ConversationEntity>
  ) {}

  async create(
    userId: ObjectId,
    createConversationRoomDto: CreateConversationRoomDto
  ) {
    const participants = createConversationRoomDto.participants.map((item) =>
      item.toString()
    );

    participants.push(userId.toString())

    const result = await this.conversationRepo.save({
      participants: participants,
      created_by: userId,
    });

    return result;
  }

  async findAll(userId: ObjectId) {
    const conversationList = await this.conversationRepo.createQueryBuilder('conversation')
    .where('conversation.participants IN (:...participants)', { participants: [userId.toString()] })
    .getMany();

    return conversationList;
  }
}
