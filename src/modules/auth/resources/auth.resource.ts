import { ResourceDto } from '@common/resources/paginate.resource';
import { Expose, Type } from 'class-transformer';

export class AuthResource {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class AuthResourceDto extends ResourceDto {
  @Expose()
  @Type(() => AuthResource)
  data: AuthResource;
}
