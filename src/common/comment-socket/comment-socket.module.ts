import { Module } from '@nestjs/common';
import { CommentSocketGateway } from './comment-socket.gateway';
import { CommentSocketService } from './comment-socket.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OauthUserRepository } from '@repositories/o-auth.repository';
import { UserRepository } from '@repositories/user.repository';
import { Logger } from '@utils/logger/logger.service';

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
    Logger,
  ],
  exports: [CommentSocketService],
})
export class CommentSocketModule {}
