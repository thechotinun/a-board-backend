import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { UserRepository } from '@repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
