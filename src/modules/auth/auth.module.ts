import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@modules/auth/services/auth.service';
import { AuthController } from '@modules/auth/controllers/auth.controller';
import { OauthUserRepository } from '@repositories/o-auth.repository';
import { UserRepository } from '@repositories/user.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, OauthUserRepository, UserRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
