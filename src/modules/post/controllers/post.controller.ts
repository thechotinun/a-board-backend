import { Req, Body, Controller, Post } from '@nestjs/common';
import { Request } from 'express';
import { PostService } from '@modules/post/services/post.service';
import { ApiResource } from '@common/reponses/api-resource';
import { CreatePostDto } from '@modules/post/dto/create-post.dto';
import { AuthenticatedRequest } from '@common/middlewares/auth/authenticate.middlewares';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post Community')
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
}
