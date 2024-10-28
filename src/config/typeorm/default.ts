import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isTesting = this.configService.get<string>('mode') === 'test';

    let defaultOptions: TypeOrmModuleOptions = {
      type: this.configService.get<string>('database.type') as 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      entities: [__dirname + '/../../**/*.entity.{js,ts}'],
      synchronize: this.configService.get<boolean>('database.sync'),
    };

    if (isTesting) {
      defaultOptions = {
        ...defaultOptions,
        database: this.configService.get<string>('database.name'),
        synchronize: this.configService.get<boolean>('database.sync'),
      };
    }

    return defaultOptions;
  }
}
export default TypeOrmConfigService;
