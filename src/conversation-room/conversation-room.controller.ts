/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpStatusCode } from 'axios';

import { ConversationRoomService } from './conversation-room.service';
import type { CreateConversationRoomDto } from './dto/create-conversation-room.dto';
import { JwtAuthGuard } from '@core/guards';
import { MapResponseSwagger } from '@core/utils/helper';
import { ConversationEntity } from '@model/conversation.entity';

@ApiTags('Conversation Room Api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversation-room')
export class ConversationRoomController {
  constructor(
    private readonly conversationRoomService: ConversationRoomService,
    private readonly events: EventEmitter2,
  ) {}

  @ApiOperation({ summary: 'Create new conversation room' })
  @MapResponseSwagger(ConversationEntity, {isArray: false, status: 200})
  @Post()
  async create(@Req() req, @Body() createConversationRoomDto: CreateConversationRoomDto, @Response() res) {
      const conversation = await this.conversationRoomService.create(req.user._id, createConversationRoomDto);

      this.events.emit('conversation.create', conversation);

      return res.status(HttpStatusCode.Created).json({ data: conversation })
  }

  @ApiOperation({ summary: 'Get all user conversation' })
  @MapResponseSwagger(ConversationEntity, {isArray: true, status: 200})
  @Get()
  findAll(@Req() req, @Response() res) {
      const result = this.conversationRoomService.findAll(req.user);

      return res.status(HttpStatusCode.Ok).json({ data: result})
  }
}
