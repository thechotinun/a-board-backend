import { ResourceWithPaginateDto } from '@common/resources/paginate.resource';
import { Expose, Type } from 'class-transformer';

export class CommunityDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class CommunityResourceDto extends ResourceWithPaginateDto {
  @Expose()
  @Type(() => CommunityDto)
  data: CommunityDto;
}
