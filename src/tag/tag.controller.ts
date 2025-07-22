import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  // В конструкторе внедряем TagService для использования его методов
  // Этот контроллер будет отвечать на запросы к /tags
  // и использовать методы TagService для обработки логики
  // private означает, что tagService доступен только внутри этого класса
  // readonly означает, что tagService не может быть переназначен после инициализации
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
