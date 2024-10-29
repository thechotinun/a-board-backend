import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { PostComment } from '@entities/comment.entity';

@Injectable()
export class CommentRepository extends BaseRepository<PostComment> {
  constructor(private dataSource: DataSource) {
    super(PostComment, dataSource.createEntityManager());
  }
}
