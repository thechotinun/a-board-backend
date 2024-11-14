import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { UserRepository } from '@repositories/user.repository';
import { OauthUserRepository } from '@repositories/o-auth.repository';
import { PostRepository } from '@repositories/post.repository';
import { CommentRepository } from '@repositories/comment.repository';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import TypeOrmConfigService from '@config/typeorm/default';
import configuration from '@config/configuration';
import { User } from '@entities/user.entity';
import { OauthUser } from '@entities/o-auth-user.entity';
import { Post } from '@entities/post.entity';
import { PostComment } from '@entities/comment.entity';

describe('Auth Integration Tests', () => {
  let module: TestingModule;
  let authService: AuthService;
  let userRepository: UserRepository;
  let oauthRepository: OauthUserRepository;
  let postRepository: PostRepository;
  let commentRepository: CommentRepository;

  beforeAll(async () => {
    // Load environment for testing
    process.env.NODE_ENV = 'test';
    await new Promise((resolve) => setTimeout(resolve, 500));

    module = await Test.createTestingModule({
      imports: [
        // using ConfigModule with configuration
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),

        // using TypeOrmConfigService
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
        }),

        TypeOrmModule.forFeature([User, OauthUser, Post, PostComment]), //register
        JwtModule.register({}),
      ],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: (dataSource: DataSource) => {
            return new UserRepository(dataSource);
          },
          inject: [DataSource],
        },
        {
          provide: OauthUserRepository,
          useFactory: (dataSource: DataSource) => {
            return new OauthUserRepository(dataSource);
          },
          inject: [DataSource],
        },
        {
          provide: PostRepository,
          useFactory: (dataSource: DataSource) => {
            return new PostRepository(dataSource);
          },
          inject: [DataSource],
        },
        {
          provide: CommentRepository,
          useFactory: (dataSource: DataSource) => {
            return new CommentRepository(dataSource);
          },
          inject: [DataSource],
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    oauthRepository = module.get<OauthUserRepository>(OauthUserRepository);
    postRepository = module.get<PostRepository>(PostRepository);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  afterEach(async () => {
    await postRepository.delete({});
    await commentRepository.delete({});
    await oauthRepository.delete({});
    await userRepository.delete({});
  });

  afterAll(async () => {
    await module.close();
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const testUser = await userRepository.save({
        userName: 'testuser',
      });

      const result = await authService.signIn({
        userName: 'testuser',
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const oauth = await oauthRepository.findOne({
        where: { user: { id: testUser.id } },
      });
      expect(oauth).toBeDefined();
    });
  });
});
