import { Expose } from 'class-transformer';

export class BaseResourceDto {
  @Expose()
  id: number;

  @Expose()
  isActive: boolean;

  @Expose()
  createdDate: Date;

  @Expose()
  createdBy: number;

  @Expose()
  updatedDate: Date;

  @Expose()
  updatedBy: number;
}
