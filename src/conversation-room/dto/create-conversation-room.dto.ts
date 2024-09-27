import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import type { ObjectId } from "typeorm";

export class CreateConversationRoomDto {
    @ApiProperty({ example: ['xxxxx'] })
    @IsNotEmpty({ message: 'Penerima tidak valid' })
    participants: ObjectId[];
}