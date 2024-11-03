import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  communityId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string;
}
