import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user.repository';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    await this.seedUser();
  }

  private async seedUser() {
    const existingUser = await this.userRepository.findOne({
      where: { userName: 'admin' },
    });

    if (!existingUser) {
      const user = this.userRepository.create({
        userName: 'admin',
      });
      await this.userRepository.save(user);
      console.log('You can sign-in with username: "admin"');
    } else {
      console.log('username: "admin" already exists');
    }
  }
}
