import { ApiProperty } from '@nestjs/swagger';
import type { ObjectId} from 'typeorm';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('chat')
@Unique("UN_ConverstionRm", ['_id', 'participants'])
export class ConversationEntity {
  @ApiProperty({ type: String, example: 'xxxxx' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({ type: Array(String), example: ['xxxxx'] })
  @Column("text", { array: true })
  participants: string[];

  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  name: string;

  @ApiProperty({ type: String, example: 'xxxxx' })
  @Column()
  created_by: ObjectId;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
