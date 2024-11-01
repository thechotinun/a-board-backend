import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from '@entities/community.entity';
import { CommunityService } from '@modules/community/services/community.service';
import { CommunityRepository } from '@repositories/community.repository';
import { CommunityController } from '@modules/community/controllers/community.controller';
import { Logger } from '@common/logger/logger.service';
import { LoggerModule } from '@common/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community]), LoggerModule],
  controllers: [CommunityController],
  providers: [CommunityRepository, CommunityService, Logger],
  exports: [CommunityService],
})
export class CommunityModule {}
