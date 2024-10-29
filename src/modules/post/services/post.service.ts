import { Post } from '@entities/post.entity';
import { User } from '@entities/user.entity';
import { PostComment } from '@entities/comment.entity';
import { PostException } from '@exceptions/app/post.exception';
import { CreatePostDto } from '@modules/post/dto/create-post.dto';
import { UpdatePostDto } from '@modules/post/dto/update-post.dto';
import { CreateCommentDto } from '@modules/post/dto/create-comment.dto';
import { UpdateCommentDto } from '@modules/post/dto/update-comment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '@repositories/post.repository';
import { CommunityRepository } from '@repositories/community.repository';
import { CommentRepository } from '@repositories/comment.repository';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';

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

  async paginate(options: IPaginationOptions): Promise<Pagination<Post>> {
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
      .orderBy('posts.createdDate', 'DESC');

    return paginate<Post>(queryBuilder, options);
  }

  async findOneById(id: string): Promise<Post> {
    try {
      const post = await this.postRepository
        .createQueryBuilder('post')
        .select([
          'post.id',
          'post.title',
          'post.description',
          'post.createdDate',
          'user.userName',
        ])
        .leftJoin('post.user', 'user')
        .leftJoinAndSelect('post.community', 'community')
        .loadRelationCountAndMap('post.commentCount', 'post.comment')
        .where('post.id = :id', { id })
        .getOne();

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    } catch (error) {
      throw PostException.notFound();
    }
  }

  async update(id: string, payload: UpdatePostDto, user: User): Promise<Post> {
    try {
      let community: { id: string; name: string };
      if (payload.communityId) {
        community = await this.checkCommunity(payload.communityId);

        if (!community) {
          throw new Error('COMMUNITY_NOT_FOUND');
        }
      }

      const post = await this.postRepository.findOne({
        where: { id: id, user: user },
      });
      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      delete payload.communityId;

      await this.postRepository.update(id, {
        ...payload,
        community: community,
        updatedBy: user.id,
      });

      return await this.findOneById(id);
    } catch (error) {
      throw PostException.updateError(error.message);
    }
  }

  async remove(id: string, user: User): Promise<UpdateResult> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: id, user: user },
      });
      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      await this.findOneById(id);

      return await this.postRepository.softDelete(id);
    } catch (error) {
      throw PostException.deleteError(error.message);
    }
  }

  //PostComment

  async createComment(
    postId: string,
    payload: CreateCommentDto,
    user: User,
  ): Promise<PostComment> {
    try {
      const post = await this.checkPost(postId);

      if (!post) {
        throw new Error('COMMENT_NOT_FOUND');
      }

      const create = await this.commentRepository.create(payload);
      create.post = post;
      create.user = user;
      create.createdBy = user.id;
      create.updatedBy = user.id;

      const saveComment = await this.commentRepository.save(create);

      const commentFromUser = await this.commentRepository.findOne({
        where: { id: saveComment.id },
        select: {
          id: true,
          text: true,
          createdDate: true,
        },
      });

      return commentFromUser;
    } catch (error) {
      throw PostException.createError(error.message);
    }
  }

  async updateComment(
    postId: string,
    id: string,
    payload: UpdateCommentDto,
    user: User,
  ): Promise<PostComment> {
    try {
      const post = await this.checkPost(postId);
      if (!post) {
        throw new Error('COMMENT_NOT_FOUND');
      }

      const comment = await this.commentRepository.findOne({
        where: { id: id, user: { id: user.id }, post: { id: post.id } },
        relations: ['user', 'post'],
      });
      if (!comment) {
        throw new Error('COMMENT_NOT_FOUND');
      }

      await this.commentRepository.update(id, {
        ...payload,
        updatedBy: user.id,
      });

      const updateCommentFromUser = await this.commentRepository.findOne({
        where: { id: id },
        select: {
          id: true,
          text: true,
          createdDate: true,
        },
      });

      return updateCommentFromUser;
    } catch (error) {
      throw PostException.updateError(error.message);
    }
  }

  async removeComment(
    postId: string,
    id: string,
    user: User,
  ): Promise<UpdateResult> {
    try {
      const post = await this.checkPost(postId);

      if (!post) {
        throw new Error('COMMENT_NOT_FOUND');
      }

      const comment = await this.commentRepository.findOne({
        where: { id: id, user: { id: user.id }, post: { id: post.id } },
      });
      if (!comment) {
        throw new Error('COMMENT_NOT_FOUND');
      }

      return await this.commentRepository.softDelete(id);
    } catch (error) {
      throw PostException.deleteError(error.message);
    }
  }
}
