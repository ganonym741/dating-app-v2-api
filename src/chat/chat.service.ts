import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import type { CreateNewChatDto } from './dto/chat.dto';
import { ChatEntity } from '@model/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity) private chatRepo: Repository<ChatEntity>
  ) {}

  async create(createAlbumDto: CreateNewChatDto) {
    const result = await this.chatRepo.save(createAlbumDto);

    if (result._id) return 'Album berhasil ditambahkan!';
  }
}
