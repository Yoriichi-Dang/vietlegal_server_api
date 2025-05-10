import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';
@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  attachment_id: number;

  @Column()
  message_id: number;

  @Column({ length: 1000 })
  file_path: string;

  @Column({ length: 255 })
  file_name: string;

  @Column({ length: 100 })
  file_type: string;

  @Column()
  file_size: number;

  @Column({ length: 64, nullable: true })
  content_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Message, (message) => message.attachments)
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
