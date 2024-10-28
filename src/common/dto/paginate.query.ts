import { ConfigService } from '@nestjs/config';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { defaultTo } from 'lodash';

const configService = new ConfigService();

export class PaginateQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) =>
    parseInt(defaultTo(value, configService.get<number>('PER_PAGE'))),
  )
  @Expose({ name: 'perPage' })
  @IsNumber()
  limit: number;

  constructor(page = 1, perPage = configService.get<number>('PER_PAGE')) {
    this.page = page;
    this.limit = +perPage;
  }
}
