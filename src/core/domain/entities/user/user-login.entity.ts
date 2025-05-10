import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsEmail, MinLength, Matches } from 'class-validator';
import { UserData } from './user-data.entity';
import { Exclude } from 'class-transformer';
import { Conversation } from '../chat/conversation.entity';
import { Role } from './role.entity';

@Entity('users_login')
export class UserLogin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column({ nullable: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  role_id: number;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  tokenExpired: Date;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordTokenExpired: Date;

  // OAuth fields
  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  providerAccountId: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  idToken: string;

  @OneToOne(() => UserData, (userData) => userData.userLogin, {
    cascade: true,
  })
  @JoinColumn()
  userData: UserData;

  @OneToMany(() => Conversation, (conversation) => conversation.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  conversations: Conversation[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

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
