import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { Attachment } from './attachment.entity';
import { AIModel } from './ai_model.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  model_id: number;

  @Column()
  conversation_id: number;

  @Column({ length: 20 })
  sender_type: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 20, default: 'text' })
  message_type: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @OneToMany(() => Attachment, (attachment) => attachment.message, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  attachments: Attachment[];

  @ManyToOne(() => AIModel, (model) => model.messages, { nullable: true })
  @JoinColumn({ name: 'model_id' })
  model: AIModel;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
