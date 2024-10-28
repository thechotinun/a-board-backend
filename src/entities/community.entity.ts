import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Post } from './post.entity';

@Entity('communitys')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => Post, (post) => post.community)
  post: Post[];
}
