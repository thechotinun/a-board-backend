import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { OauthUser } from './o-auth-user.entity';
import { Post } from './post.entity';
import { PostComment } from './comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  userName: string;

  @OneToMany(() => OauthUser, (oAuth) => oAuth.user)
  oAuth: OauthUser[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => PostComment, (comment) => comment.user)
  comment: PostComment[];
}
