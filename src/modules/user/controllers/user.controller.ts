import { Req, Controller, Get, Query } from '@nestjs/common';
import { Request } from 'express';
import { ApiResource } from '@common/reponses/api-resource';
import { AuthenticatedRequest } from '@common/middlewares/auth/authenticate.middlewares';
import { UseResources } from '@interceptors/use-resources.interceptor';
import { PostResourceDto } from '@modules/post/resources/post.resource';
import { PaginateQuery } from '@common/dto/paginate.query';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('me')
  async me(@Req() request: Request): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      delete user.id;
      return ApiResource.successResponse(user);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @ApiBearerAuth()
  @Get('post')
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
    @Req() request: Request,
    @Query() { page, limit }: PaginateQuery,
    @Query()
    query: {
      title?: string;
      communityId?: string;
    },
  ): Promise<ApiResource> {
    try {
      const user = (request as AuthenticatedRequest).user;
      const reponse = await this.userService.paginate(
        user,
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
}
