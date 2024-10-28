import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { User } from '@entities/user.entity';
import { UserException } from '@exceptions/app/user.exception';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findOneUser(userName: string): Promise<User> {
    return await this.findOneOrFail({
      where: {
        userName: userName,
      },
    }).catch(() => {
      throw UserException.notFound();
    });
  }
}
