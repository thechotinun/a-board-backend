import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthException } from '@exceptions/app/auth.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user.repository';
import { AuthService } from '@modules/auth/services/auth.service';
import { User } from '@entities/user.entity';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return AuthException.Unauthorized();

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      try {
        const payload = await this.authService.validateToken(token);
        const user = JSON.stringify(payload.user);
        const { id, userName } = JSON.parse(user);
        const profile = await this.userRepository.findOneByOrFail({
          id: id,
          userName: userName,
        });
        (req as AuthenticatedRequest).user = profile;
      } catch (error) {
        return AuthException.Unauthorized();
      }
    }

    next();
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
