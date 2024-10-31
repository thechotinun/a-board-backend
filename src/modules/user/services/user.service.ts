import { Post } from '@entities/post.entity';
import { User } from '@entities/user.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '@repositories/post.repository';
import { UserRepository } from '@repositories/user.repository';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  async onModuleInit() {
    await this.seedUser();
  }

  private async seedUser() {
    const existingUser = await this.userRepository.findOne({
      where: { userName: 'admin' },
    });

    if (!existingUser) {
      const user = this.userRepository.create({
        userName: 'admin',
      });
      await this.userRepository.save(user);
      console.log('You can sign-in with username: "admin"');
    } else {
      console.log('username: "admin" already exists');
    }
  }

  async paginate(
    user: User,
    options: IPaginationOptions,
  ): Promise<Pagination<Post>> {
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

    return paginate<Post>(queryBuilder, options);
  }
}
