import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserLogin } from './user-login.entity';

@Entity('users_data')
export class UserData {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Changed from number to string (uuid) to match UserLogin.id type

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  // Relation to UserLogin
  @OneToOne(() => UserLogin, (userLogin) => userLogin.userData)
  userLogin: UserLogin;
}
