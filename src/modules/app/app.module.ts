import { Module } from '@nestjs/common';
import configuration from '@config/configuration';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import TypeOrmConfigService from '@config/typeorm/default';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from '@exceptions/exception.filter';
import { AuthModule } from '@modules/auth/auth.module';
import { PostModule } from '@modules/post/post.module';
import { UserModule } from '@modules/user/user.module';
import { CommunityModule } from '@modules/community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    AuthModule,
    PostModule,
    UserModule,
    CommunityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
