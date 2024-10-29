import { Controller, Get, Query } from '@nestjs/common';
import { PaginateQuery } from '@common/dto/paginate.query';
import { CommunityService } from '@modules/community/services/community.service';
import { ApiResource } from '@common/reponses/api-resource';
import { UseResources } from '@interceptors/use-resources.interceptor';
import { CommunityResourceDto } from '@modules/community/resources/community.resource';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Community')
@Controller('api/v1/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
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
  @UseResources(CommunityResourceDto)
  async paginate(
    @Query() { page, limit }: PaginateQuery,
  ): Promise<ApiResource> {
    try {
      const reponse = await this.communityService.paginate({
        page,
        limit,
      });

      return ApiResource.successResponse(reponse);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }
}
