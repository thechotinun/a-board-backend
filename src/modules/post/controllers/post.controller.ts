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
import { UseResources } from '@interceptors/use-resources.interceptor';
import { PostResourceDto } from '@modules/post/resources/post.resource';
import { AuthenticatedRequest } from '@common/middlewares/auth/authenticate.middlewares';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @Get()
  @UseResources(PostResourceDto)
  async paginate(
    @Query() { page, limit }: PaginateQuery,
  ): Promise<ApiResource> {
    try {
      const reponse = await this.postService.paginate({
        page,
        limit,
      });

      return ApiResource.successResponse(reponse);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ApiResource> {
    try {
      const response = await this.postService.findOneById(id);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

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
}
