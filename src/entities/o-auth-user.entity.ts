import { v4 as uuidv4 } from 'uuid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('oAuthUser')
export class OauthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  // @Column({ name: 'userId', type: 'uuid' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  accessToken: string;

  @Column({ type: 'uuid' })
  refreshToken: string;

  @BeforeInsert()
  insertCreated() {
    this.refreshToken = uuidv4();
    this.accessToken = uuidv4();
  }
}
