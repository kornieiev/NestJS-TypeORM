import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { FollowsEntity } from './entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}
  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
      // select: ['id', 'username', 'bio', 'image'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { ...user, following: false };
  }

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    // Ищем пользователя по имени пользователя, чтобы получить его ID
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
      // select: ['id', 'username', 'bio', 'image'],
    });

    // Если пользователь не найден, выбрасываем исключение
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Логика для подписки на пользователя

    // Проверяем, что текущий пользователь не пытается подписаться на себя
    if (currentUserId === user.id) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Проверяем, что текущий пользователь не подписан на профиль
    const follow = await this.followsRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    // Если подписки нет, то создаем новую подписку
    if (!follow) {
      // Создаем новую сущность подписки
      const followToCreate = new FollowsEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      // и сохраняем ее в базе данных
      await this.followsRepository.save(followToCreate);
    }

    return { ...user, following: true }; // Здесь нужно добавить логику для проверки, подписан ли текущий пользователь на профиль
    // Например, можно проверить, есть ли текущий пользователь в списке подписчиков профиля
    // Если есть, то following будет true, иначе false
    // В реальном приложении нужно будет добавить логику для работы с подписками
    // Например, можно создать отдельную сущность для подписок и хранить там информацию о подписках
    // Или можно использовать поле favorites в сущности UserEntity для хранения подписок
    // Но это уже зависит от архитектуры приложения и требований к функционалу
  }

  async unfollowProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<UserEntity> {}

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    const { id, username, bio, image, following } = profile;
    return {
      profile: {
        id,
        username,
        bio,
        image,
        following,
        // following: false, // This should be determined based on the current user's following status
      },
    };
  }
}
