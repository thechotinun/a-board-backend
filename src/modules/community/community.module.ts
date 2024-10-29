import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from '@entities/community.entity';
import { CommunityService } from '@modules/community/services/community.service';
import { CommunityRepository } from '@repositories/community.repository';
import { CommunityController } from '@modules/community/controllers/community.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Community])],
  controllers: [CommunityController],
  providers: [CommunityRepository, CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
