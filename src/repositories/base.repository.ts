import { Injectable } from '@nestjs/common';
import { EntityManager, EntityTarget, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class BaseRepository<Entity> extends Repository<Entity> {
  constructor(
    private entity: EntityTarget<Entity>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
  ) {
    super(entity, manager);
  }
}
