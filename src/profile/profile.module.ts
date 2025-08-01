import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FollowsEntity } from './entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowsEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
