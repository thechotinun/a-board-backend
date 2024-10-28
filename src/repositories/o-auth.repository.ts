import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { OauthUser } from '@entities/o-auth-user.entity';
import { TokenTypeEnum } from '@common/enums/o-auth/token-type.enum';
import { AuthException } from '@exceptions/app/auth.exception';

@Injectable()
export class OauthUserRepository extends BaseRepository<OauthUser> {
  constructor(private dataSource: DataSource) {
    super(OauthUser, dataSource.createEntityManager());
  }

  async findToken(token: string, type: TokenTypeEnum): Promise<OauthUser> {
    return await this.findOneOrFail({
      relations: ['user'],
      where: {
        [type]: token,
      },
    }).catch(() => {
      throw AuthException.Unauthorized();
    });
  }
}
