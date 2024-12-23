import { BaseResourceDto } from '@common/resources/base.resource';
import { ResourceWithPaginateDto } from '@common/resources/paginate.resource';
import { Expose, Type } from 'class-transformer';

class CommunityDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class UserDto {
  @Expose()
  userName: string;
}

export class PostDto extends BaseResourceDto {
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CommunityDto)
  community: CommunityDto;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  commentCount: number;
}

export class PostResourceDto extends ResourceWithPaginateDto {
  @Expose()
  @Type(() => PostDto)
  data: PostDto;
}
