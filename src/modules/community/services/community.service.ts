import { Community } from '@entities/community.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityRepository } from '@repositories/community.repository';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Logger } from '@utils/logger/logger.service';

@Injectable()
export class CommunityService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,

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
        this.logger.debug(`Community "${name}" created.`);
      } else {
        this.logger.log(`Community "${name}" already exists.`);
      }
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Community>> {
    const queryBuilder =
      this.communityRepository.createQueryBuilder('communitys');

    return paginate<Community>(queryBuilder, options);
  }
}
