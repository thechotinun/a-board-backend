import { Community } from '@entities/community.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityRepository } from '@repositories/community.repository';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CommunityService implements OnModuleInit {
  constructor(
    @InjectRepository(CommunityRepository)
    private readonly communityRepository: CommunityRepository,
  ) {}

  async onModuleInit() {
    await this.seedCommunities();
  }

  private async seedCommunities() {
    const communityNames = [
      'History',
      'Food',
      'Pets',
      'Health',
      'Fashion',
      'Exercise',
      'Others',
    ];

    for (const name of communityNames) {
      const existingCommunity = await this.communityRepository.findOne({
        where: { name },
      });

      if (!existingCommunity) {
        const community = this.communityRepository.create({ name });
        await this.communityRepository.save(community);
        console.log(`Community "${name}" created.`);
      } else {
        console.log(`Community "${name}" already exists.`);
      }
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Community>> {
    const queryBuilder =
      this.communityRepository.createQueryBuilder('communitys');

    return paginate<Community>(queryBuilder, options);
  }
}
