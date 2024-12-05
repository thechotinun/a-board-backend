import { Module } from '@nestjs/common';
import { CommentSocketGateway } from './comment-socket.gateway';
import { CommentSocketService } from './comment-socket.service';

@Module({
  providers: [CommentSocketGateway, CommentSocketService],
  exports: [CommentSocketService],
})
export class CommentSocketModule {}
