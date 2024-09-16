import { ApiProperty } from '@nestjs/swagger';
import type { ObjectId } from 'typeorm';

export class GetManyAlbumDto {
  @ApiProperty({ type: String, example: 'xxxxx' })
  _id?: ObjectId;

  @ApiProperty({ example: 'uuid' })
  user_id?: string;
}
