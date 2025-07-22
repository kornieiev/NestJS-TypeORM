import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm'; // Repository - это класс, который предоставляет методы для работы с базой данных
import { InjectRepository } from '@nestjs/typeorm'; // InjectRepository - это декоратор, который позволяет использовать репозиторий для работы с сущностью TagEntity

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity) // Тут декоратор InjectRepository используется, чтобы внедрить репозиторий для работы с сущностью TagEntity
    // Репозиторий - это класс, который предоставляет методы для работы с базой данных
    private readonly tagRepository: Repository<TagEntity>, // тут создается приватное свойство tagRepository, которое будет использоваться для работы с базой данных. Это типа ORM-wrapper, который дает возможность получить доступ к свойствам и методам конкретного entity - TagEntity
    // Repository<TagEntity> - это тип, который указывает, что tagRepository будет использоваться для работы с сущностью TagEntity
  ) {}
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find(); // find - это метод репозитория, который возвращает все записи из таблицы tags
  }
}
