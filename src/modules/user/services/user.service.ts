import { Post } from '@entities/post.entity';
import { User } from '@entities/user.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '@repositories/post.repository';
import { UserRepository } from '@repositories/user.repository';
import { Logger } from '@common/logger/logger.service';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  async onModuleInit() {
    await this.seedUser();
  }

  private async seedUser() {
    const userNames = ['test', 'user', 'user01', 'admin', 'admin01'];

    for (const userName of userNames) {
      const existingUser = await this.userRepository.findOne({
        where: { userName: userName },
      });

      if (!existingUser) {
        const user = this.userRepository.create({ userName });
        await this.userRepository.save(user);
        this.logger.debug(`You can sign-in with username: "${userName}"`);
      } else {
        this.logger.log(`username: "${userName}" already exists`);
      }
    }
  }

  async paginate(
    user: User,
    options: IPaginationOptions,
    query: {
      title?: string;
      communityId?: string;
    },
  ): Promise<Pagination<Post>> {
    const { title, communityId } = query;
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.description',
        'posts.createdDate',
      ])
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('posts.community', 'community')
      .loadRelationCountAndMap('posts.commentCount', 'posts.comment')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('posts.createdDate', 'DESC');

    if (title) {
      queryBuilder.andWhere('posts.title LIKE :title', { title: `%${title}%` });
    }

    if (communityId) {
      queryBuilder.andWhere('community.id = :communityId', { communityId });
    }

    return paginate<Post>(queryBuilder, options);
  }
}
