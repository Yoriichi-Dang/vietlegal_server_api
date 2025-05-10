import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLogin } from './user-login.entity';

export enum RoleType {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
    unique: true,
  })
  name: RoleType;

  @Column({ type: 'text', nullable: true })
  description: string;

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

  @OneToMany(() => UserLogin, (user) => user.role)
  users: UserLogin[];
}
