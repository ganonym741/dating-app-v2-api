import type { ObjectId } from 'typeorm';
import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectIdColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity('album-like')
export class AlbumLikeEntity {
  @ApiProperty({ type: String, example: 'xxxxx' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  album_id: ObjectId;
  
  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  liked_by_id: ObjectId;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
