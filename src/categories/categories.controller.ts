import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('collections')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('/:categoryId')
  @UsePipes()
  @HttpCode(HttpStatus.OK)
  createProduct(@Param() { categoryId }) {
    return this.categoriesService.getProductsByCategory(categoryId);
  }
}
