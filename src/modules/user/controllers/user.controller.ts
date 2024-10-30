import { Req, Controller, Get } from '@nestjs/common';
import { Request } from 'express';
import { ApiResource } from '@common/reponses/api-resource';
import { AuthenticatedRequest } from '@common/middlewares/auth/authenticate.middlewares';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/user')
export class UserController {
  @ApiTags('User')
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
}
