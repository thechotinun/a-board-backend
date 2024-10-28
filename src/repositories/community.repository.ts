import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Community } from '@entities/community.entity';

@Injectable()
export class CommunityRepository extends BaseRepository<Community> {
  constructor(private dataSource: DataSource) {
    super(Community, dataSource.createEntityManager());
  }
}
