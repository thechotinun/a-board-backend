import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(100)
  text: string;
}
