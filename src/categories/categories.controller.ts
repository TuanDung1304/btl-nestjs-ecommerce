import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { FilterDto } from 'src/categories/dto/filter.dto';

@Controller('collections')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Post('/:categoryId')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  getProducts(@Param() { categoryId }, @Body() filter: FilterDto) {
    if (['ao-nam', 'quan-nam', 'phu-kien'].includes(categoryId))
      return this.categoriesService.getProductsByCategoryType(
        categoryId === 'ao-nam'
          ? 'Áo'
          : categoryId === 'quan-nam'
          ? 'Quần'
          : 'Phụ Kiện',
        filter,
      );
    return this.categoriesService.getProductsByCategory(categoryId, filter);
  }
}
