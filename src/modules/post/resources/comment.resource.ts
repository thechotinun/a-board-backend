import { BaseResourceDto } from '@common/resources/base.resource';
import { ResourceWithPaginateDto } from '@common/resources/paginate.resource';
import { Expose, Type } from 'class-transformer';

class UserDto {
  @Expose()
  userName: string;
}

export class PostCommentDto extends BaseResourceDto {
  @Expose()
  text: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}

export class PostCommentResourceDto extends ResourceWithPaginateDto {
  @Expose()
  @Type(() => PostCommentDto)
  data: PostCommentDto;
}
