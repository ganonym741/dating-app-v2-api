import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ObjectId, Repository } from 'typeorm';

import { ChatEntity } from '@model/chat.entity';
import type {
  CreateNewChatDto,
  DeleteChatDto,
  EditChatDto,
  GetChatDto,
  GetConversationChatDto,
} from '../dto/chat.dto';
import type { ConversationEntity } from '@model/conversation.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatEntity) private chatRepo: Repository<ChatEntity>,
    @InjectRepository(ChatEntity)
    private conversationRepo: Repository<ConversationEntity>
  ) {}

  async getMessages(
    userId: ObjectId,
    payload: GetConversationChatDto
  ): Promise<GetChatDto[]> {
    const { conversationId, page = 1, pageSize = 20 } = payload;

    const isParticipant = (
      await this.conversationRepo.findOne({
        select: { participants: true },
        where: { _id: conversationId },
      })
    )?.participants.includes(userId.toString());

    if (isParticipant) {
      const messages = await this.chatRepo.find({
        where: {
          conversation_id: conversationId,
          deleted_at: null,
        },
        order: { created_at: 'desc' },
        take: pageSize,
        skip: pageSize * page - page,
      });

      return messages.map((message) => ({
        messageId: message._id,
        message: message.message,
        senderId: message.sender_id,
        createdAt: message.created_at,
      }));
    }

    throw new UnauthorizedException('Gagal mengambil pesan. Unauthorized!');
  }

  async create(
    userId: ObjectId,
    createMessageDto: CreateNewChatDto
  ): Promise<GetChatDto[]> {

    const isParticipant = (
      await this.conversationRepo.findOne({
        select: { participants: true },
        where: { _id: createMessageDto.conversationId },
      })
    )?.participants.includes(userId.toString());

    if (isParticipant) {
      const message = this.chatRepo.create({
        ...createMessageDto,
        sender_id: userId,
      });

      return [
        {
          messageId: message._id,
          message: message.message,
          senderId: message.sender_id,
          createdAt: message.created_at,
        },
      ];
    }

    throw new UnauthorizedException('Gagal mengirim pesan. Unauthorized!');
  }

  async update(
    userId: ObjectId,
    updateMessageDto: EditChatDto
  ): Promise<GetChatDto[]> {
    const { conversationId, messageId, message } = updateMessageDto;

    const result = await this.chatRepo.update(
      { _id: messageId, sender_id: userId, conversation_id: conversationId },
      { message: message }
    );

    if (result.affected === 1) {
      return [
        {
          messageId: messageId,
          senderId: userId,
          message: message,
          createdAt: null,
        },
      ];
    }

    throw new UnauthorizedException('Gagal mengubah pesan. Unauthorized!');
  }

  async delete(
    userId: ObjectId,
    deleteChatDto: DeleteChatDto
  ): Promise<GetChatDto[]> {
    const { conversationId, messageId } = deleteChatDto;

    const getMessage = await this.chatRepo.findOne({
      select: { sender_id: true, conversation_id: true },
      where: { _id: messageId },
    });

    if (
      getMessage &&
      getMessage.conversation_id === conversationId &&
      getMessage.sender_id === userId
    ) {
      const result = await this.chatRepo.softDelete(messageId);

      if (result.affected === 1) {
        return [
          {
            messageId: messageId,
            senderId: userId,
            message: null,
            createdAt: null,
          },
        ];
      }
    }

    throw new UnauthorizedException('Gagal mengubah pesan. Unauthorized!');
  }
}
