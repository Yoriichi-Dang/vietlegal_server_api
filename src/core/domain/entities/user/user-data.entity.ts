import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLogin } from './user-login.entity';

@Entity('users_data')
export class UserData {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Changed from number to string (uuid) to match UserLogin.id type

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  // Relation to UserLogin
  @OneToOne(() => UserLogin, (userLogin) => userLogin.userData)
  userLogin: UserLogin;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
