import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('comments')
export class PostComment extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  text: string;

  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'userId' })
  user: User;
}
