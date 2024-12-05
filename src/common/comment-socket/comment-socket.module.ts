import { Module } from '@nestjs/common';
import { CommentSocketGateway } from './comment-socket.gateway';
import { CommentSocketService } from './comment-socket.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OauthUserRepository } from '@repositories/o-auth.repository';
import { UserRepository } from '@repositories/user.repository';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    CommentSocketGateway,
    CommentSocketService,
    AuthService,
    OauthUserRepository,
    UserRepository,
  ],
  exports: [CommentSocketService],
})
export class CommentSocketModule {}
