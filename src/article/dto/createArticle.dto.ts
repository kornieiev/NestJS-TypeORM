import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly body: string;

  @IsString({ each: true }) // Используем each: true для валидации каждого элемента массива
  readonly tagList?: string[];
}
