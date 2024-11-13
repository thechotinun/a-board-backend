import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OauthUserRepository } from '@repositories/o-auth.repository';
import { UserRepository } from '@repositories/user.repository';
// import { TokenTypeEnum } from '@common/enums/o-auth/token-type.enum';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { UserException } from '@exceptions/app/user.exception';
// import { AuthException } from '@exceptions/app/auth.exception';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let oAuthUserRepository: OauthUserRepository;
  let userRepository: UserRepository;

  // Mock repositories and services
  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockOAuthUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    findToken: jest.fn(),
  };

  const mockUserRepository = {
    findOneOrFail: jest.fn(),
    findOneUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(OauthUserRepository),
          useValue: mockOAuthUserRepository,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    oAuthUserRepository = module.get(getRepositoryToken(OauthUserRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        userName: 'testuser',
      };

      const mockUser = {
        id: '1',
        userName: 'testuser',
      };

      const mockOAuthUser = {
        id: '1',
        user: '1',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockUserRepository.findOneUser.mockResolvedValue(mockUser);
      mockOAuthUserRepository.create.mockReturnValue(mockOAuthUser);
      mockOAuthUserRepository.save.mockResolvedValue(mockOAuthUser);

      mockConfigService.get.mockImplementation((key: string) => {
        const config = {
          'jwt.access.secret': 'access-secret',
          'jwt.access.expire': '15m',
          'jwt.refresh.secret': 'refresh-secret',
          'jwt.refresh.expire': '7d',
        };
        return config[key];
      });

      mockJwtService.signAsync
        .mockResolvedValueOnce('signed-access-token')
        .mockResolvedValueOnce('signed-refresh-token');

      // Act
      const result = await service.signIn(loginDto);

      // Assert
      expect(result).toEqual({
        accessToken: 'signed-access-token',
        refreshToken: 'signed-refresh-token',
      });
      expect(userRepository.findOneUser).toHaveBeenCalledWith(
        loginDto.userName,
      );
      expect(oAuthUserRepository.create).toHaveBeenCalledWith({
        user: mockUser.id,
      });
    });

    it('should throw UserException when user not found', async () => {
      // Arrange
      const loginDto: LoginDto = {
        userName: 'notfounduser',
      };

      mockUserRepository.findOneUser.mockRejectedValue(
        UserException.notFound(),
      );

      // Act & Assert
      await expect(service.signIn(loginDto)).rejects.toThrow(
        UserException.notFound(),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const loginDto: LoginDto = {
        userName: 'nonexistent',
      };
      mockUserRepository.findOneUser.mockRejectedValue(
        new UnauthorizedException(),
      );

      // Act & Assert
      await expect(service.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
