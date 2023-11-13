import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { FilterDto } from 'src/categories/dto/filter.dto';

@Controller('collections')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Post('/:categoryId')
  @HttpCode(HttpStatus.OK)
  getProducts(@Param() { categoryId }, @Body() filter: FilterDto) {
    return this.categoriesService.getProductsByCategory(categoryId, filter);
  }
}
