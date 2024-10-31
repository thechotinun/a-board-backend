import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { UserController } from '@modules/user/controllers/user.controller';
import { UserRepository } from '@repositories/user.repository';
import { PostRepository } from '@repositories/post.repository';
import { AuthenticateMiddleware } from '@common/middlewares/auth/authenticate.middlewares';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserRepository, UserService, PostRepository],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateMiddleware).forRoutes(UserController);
  }
}
