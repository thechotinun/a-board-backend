import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(100)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(255)
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  communityId?: string;
}