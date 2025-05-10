import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { UserLogin } from '../user/user-login.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: true })
  is_archived: boolean;

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

  @ManyToOne(() => UserLogin, (user) => user.conversations)
  @JoinColumn({ name: 'user_id' })
  user: UserLogin;

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
