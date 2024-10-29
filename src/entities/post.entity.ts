import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Community } from './community.entity';
import { PostComment } from './comment.entity';
import { User } from './user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @ManyToOne(() => Community, (community) => community.post)
  @JoinColumn({ name: 'communityId' })
  community: Community;

  @OneToMany(() => PostComment, (comment) => comment.post)
  comment: PostComment[];

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'userId' })
  user: User;
}
