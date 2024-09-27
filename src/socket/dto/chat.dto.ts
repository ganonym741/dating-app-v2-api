import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import type { ObjectId } from 'typeorm';

export class GetConversationChatDto {
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Penerima tidak valid' })
    conversationId: ObjectId;
    
    @ApiProperty({ example: 1, default: 1 })
    page?: number;

    @ApiProperty({ example: 10, default: 10 })
    pageSize?: number;
}

export class GetChatDto {
    @ApiProperty({ example: 'xxxxx' })
    messageId: ObjectId;

    @ApiProperty({ example: 'xxxxx' })
    senderId: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    message: string;

    @ApiProperty({ example: '2024-08-09 00:00:00' })
    createdAt: Date;
}

export class CreateNewChatDto {    
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Penerima tidak valid' })
    conversationId: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan kosong' })
    message: string;
}

export class EditChatDto {
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Penerima tidak valid' })
    conversationId: ObjectId;

    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan tidak bisa di edit' })
    messageId: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan kosong' })
    message: string;
}

export class DeleteChatDto {
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Penerima tidak valid' })
    conversationId: ObjectId;

    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan tidak bisa di delete' })
    messageId: ObjectId;
}
