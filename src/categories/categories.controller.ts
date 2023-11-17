import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { FilterDto } from 'src/categories/dto/filter.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('collections')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(RolesGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Public()
  @Post('/:categoryId')
  @HttpCode(HttpStatus.OK)
  getProducts(@Param() { categoryId }, @Body() filter: FilterDto) {
    return this.categoriesService.getProductsByCategory(categoryId, filter);
  }
}
