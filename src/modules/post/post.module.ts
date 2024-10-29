import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PostRepository } from '@repositories/post.repository';
import { UserRepository } from '@repositories/user.repository';
import { CommunityRepository } from '@repositories/community.repository';
import { CommentRepository } from '@repositories/comment.repository';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { AuthenticateMiddleware } from '@common/middlewares/auth/authenticate.middlewares';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PostController],
  providers: [
    PostRepository,
    UserRepository,
    CommunityRepository,
    CommentRepository,
    PostService,
  ],
  exports: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: 'api/v1/post', method: RequestMethod.GET },
        { path: 'api/v1/post/:id', method: RequestMethod.GET },
      )
      .forRoutes(PostController);
  }
}
