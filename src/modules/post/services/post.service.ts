import { Post } from '@entities/post.entity';
import { User } from '@entities/user.entity';
import { PostException } from '@exceptions/app/post.exception';
import { CreatePostDto } from '@modules/post/dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '@repositories/post.repository';
import { CommunityRepository } from '@repositories/community.repository';
import { CommentRepository } from '@repositories/comment.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    @InjectRepository(CommunityRepository)
    private readonly communityRepository: CommunityRepository,

    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
  ) {}

  async checkPost(postId: string) {
    return await this.postRepository.findOne({
      where: { id: postId },
    });
  }

  async checkCommunity(communityId: string) {
    return await this.communityRepository.findOne({
      where: { id: communityId },
    });
  }

  async create(payload: CreatePostDto, user: User): Promise<Post> {
    try {
      const community = await this.checkCommunity(payload.communityId);

      if (!community) {
        throw new Error('COMMUNITY_NOT_FOUND');
      }

      const create = await this.postRepository.create(payload);
      create.user = user;
      create.community = community;
      create.createdBy = user.id;
      create.updatedBy = user.id;

      const savedPost = await this.postRepository.save(create);
      const postWithUser = await this.postRepository.findOne({
        where: { id: savedPost.id },
        relations: ['user', 'community'],
        select: {
          id: true,
          title: true,
          description: true,
          community: {
            name: true,
          },
          user: {
            userName: true,
          },
        },
      });

      return postWithUser;
    } catch (error) {
      throw PostException.createError(error.message);
    }
  }
}
