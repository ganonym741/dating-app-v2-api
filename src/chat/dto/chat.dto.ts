import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import type { ObjectId } from 'typeorm';

export class GetChatResDto {
    @ApiProperty({ example: 'xxxxx' })
    _id: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    message: string;

    @ApiProperty({ example: '2024-08-09 00:00:00' })
    updated_at: Date;
}

export class CreateNewChatDto {
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pengirim tidak valid' })
    sender_id: ObjectId;
    
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Penerima tidak valid' })
    receiver_id: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan kosong' })
    message: string;
}

export class EditNewChatDto {
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan tidak bisa di edit' })
    _id: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    @IsNotEmpty({ message: 'Pesan kosong' })
    message: string;
}
