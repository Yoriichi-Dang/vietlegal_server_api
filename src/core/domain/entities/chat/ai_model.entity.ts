import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('ai_models')
export class AIModel {
  @PrimaryGeneratedColumn()
  model_id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100 })
  provider: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Message, (message) => message.model, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
