import type {
  ObjectId} from 'typeorm';
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectIdColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity('album')
export class AlbumEntity {
  @ApiProperty({ type: String, example: 'xxxxx' })
  @ObjectIdColumn()
  _id: ObjectId
  
  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  user_id: ObjectId;

  @ApiProperty({ example: 'https://photo_1' })
  @Column()
  photo_1: string;

  @ApiProperty({ example: 'https://photo_2' })
  @Column({ nullable: true })
  photo_2: string;

  @ApiProperty({ example: 'https://photo_3' })
  @Column({ nullable: true })
  photo_3: string;

  @ApiProperty({ example: 'https://photo_4' })
  @Column({ nullable: true })
  photo_4: string;

  @ApiProperty({ example: 'https://photo_5' })
  @Column({ nullable: true })
  photo_5: string;

  @ApiProperty({ example: 'Deskripsinya kalau ada' })
  @Column('text', { nullable: true })
  descriptions: string;

  @ApiProperty({ example: 'Total like' })
  @Column({ nullable: true, type: 'int', default: 0 })
  like: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
