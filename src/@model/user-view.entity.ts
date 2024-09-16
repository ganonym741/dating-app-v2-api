import type {
  ObjectId} from 'typeorm';
import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectIdColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user-view')
export class UserViewEntity {
  @ApiProperty({ type: String, example: 'xxxxx' })
  @ObjectIdColumn()
  _id: ObjectId

  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  user_id: ObjectId;

  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  viewed_by_id: ObjectId;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
