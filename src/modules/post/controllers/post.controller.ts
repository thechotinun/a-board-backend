import {
  Req,
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { PaginateQuery } from '@common/dto/paginate.query';
import { PostService } from '@modules/post/services/post.service';
import { ApiResource } from '@common/reponses/api-resource';
import { CreatePostDto } from '@modules/post/dto/create-post.dto';
import { UpdatePostDto } from '@modules/post/dto/update-post.dto';
import { CreateCommentDto } from '@modules/post/dto/create-comment.dto';
import { UpdateCommentDto } from '@modules/post/dto/update-comment.dto';
import { UseResources } from '@interceptors/use-resources.interceptor';
import { PostResourceDto } from '@modules/post/resources/post.resource';
import { PostCommentResourceDto } from '@modules/post/resources/comment.resource';
import { AuthenticatedRequest } from '@common/middlewares/auth/authenticate.middlewares';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiTags('Post')
  @ApiBearerAuth()
  @Post()
  async create(
    @Req() request: Request,
    @Body() payload: CreatePostDto,
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const response = await this.postService.create(payload, user);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Post')
  @Get()
  @UseResources(PostResourceDto)
  @ApiQuery({
    name: 'communityId',
    required: false,
    type: String,
    description: 'Search Items with community id',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Search Items with title',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  async paginate(
    @Query() { page, limit }: PaginateQuery,
    @Query()
    query: {
      title?: string;
      communityId?: string;
    },
  ): Promise<ApiResource> {
    try {
      const reponse = await this.postService.paginate(
        {
          page,
          limit,
        },
        query,
      );

      return ApiResource.successResponse(reponse);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Post')
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ApiResource> {
    try {
      const response = await this.postService.findOneById(id);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Post')
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() payload: UpdatePostDto,
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const response = await this.postService.update(id, payload, user);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Post')
  @ApiBearerAuth()
  @Delete(':id')
  async remove(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const response = await this.postService.remove(id, user);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  //PostComment

  @ApiTags('Comment')
  @ApiBearerAuth()
  @Post(':postId/comment')
  async createComment(
    @Req() request: Request,
    @Param('postId') postId: string,
    @Body() payload: CreateCommentDto,
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const response = await this.postService.createComment(
        postId,
        payload,
        user,
      );

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Comment')
  @Get(':postId/comment')
  @UseResources(PostCommentResourceDto)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  async paginatePostComment(
    @Param('postId') postId: string,
    @Query() { page, limit }: PaginateQuery,
  ): Promise<ApiResource> {
    try {
      const reponse = await this.postService.paginatePostComment(postId, {
        page,
        limit,
      });

      return ApiResource.successResponse(reponse);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Comment')
  @ApiBearerAuth()
  @Patch(':postId/comment/:id')
  async updateComment(
    @Req() request: Request,
    @Param('postId') postId: string,
    @Param('id') id: string,
    @Body() payload: UpdateCommentDto,
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const response = await this.postService.updateComment(
        postId,
        id,
        payload,
        user,
      );

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiTags('Comment')
  @ApiBearerAuth()
  @Delete(':postId/comment/:id')
  async removeComment(
    @Req() request: Request,
    @Param('postId') postId: string,
    @Param('id') id: string,
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const response = await this.postService.removeComment(postId, id, user);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }
}
