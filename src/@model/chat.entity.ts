import type {
    ObjectId} from 'typeorm';
  import {
    Entity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ObjectIdColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('chat')
  export class ChatEntity {
    @ApiProperty({ type: String, example: 'xxxxx' })
    @ObjectIdColumn()
    _id: ObjectId
  
    @ApiProperty({ type: String, example: 'xxxxx' })
    @Column()
    sender_id: ObjectId;
    
    @ApiProperty({ type: String, example: 'xxxxx' })
    @Column()
    receiver_id: ObjectId;
  
    @ApiProperty({ example: 'xxxxx' })
    @Column()
    message: string;
  
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
    deleted_at: Date;
  }
  