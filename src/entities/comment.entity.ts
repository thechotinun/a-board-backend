import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  text: string;

  @Column({ name: 'postId', type: 'uuid' })
  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: string;

  @Column({ name: 'userId', type: 'uuid' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: string;
}
