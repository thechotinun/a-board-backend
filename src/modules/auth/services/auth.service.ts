import { TokenTypeEnum } from '@common/enums/o-auth/token-type.enum';
import { OauthUser } from '@entities/o-auth-user.entity';
import { User } from '@entities/user.entity';
import { AuthException } from '@exceptions/app/auth.exception';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OauthUserRepository } from '@repositories/o-auth.repository';
import { UserRepository } from '@repositories/user.repository';
import { compare } from 'bcrypt';
import { get } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(OauthUserRepository)
    private readonly oAuthUserRepository: OauthUserRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  comparePassword = async (password: string, userPassword: string) =>
    await compare(password, userPassword);

  async signIn(credential: LoginDto) {
    const { userName } = credential;
    const user = await this.userRepository.findOneUser(userName);

    const oAuth: OauthUser = await this.createOauthUser(user);

    return await this.getTokens(oAuth, user.userName);
  }

  async createOauthUser(user: User): Promise<OauthUser> {
    try {
      const created: OauthUser = await this.oAuthUserRepository.create({
        userId: user.id,
      });

      return await this.oAuthUserRepository.save(created);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getTokens(oAuth: OauthUser, userName: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: oAuth.accessToken,
          userName,
        },
        {
          secret: this.configService.get<string>('jwt.access.secret'),
          expiresIn: this.configService.get<string>('jwt.access.expire'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: oAuth.refreshToken,
        },
        {
          secret: this.configService.get<string>('jwt.refresh.secret'),
          expiresIn: this.configService.get<string>('jwt.refresh.expire'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string): Promise<OauthUser> {
    try {
      const tokenPayload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.access.secret'),
      });

      return await this.oAuthUserRepository.findToken(
        get(tokenPayload, 'sub'),
        TokenTypeEnum.ACCESS_TOKEN,
      );
    } catch (error) {
      throw AuthException.Unauthorized();
    }
  }
}
