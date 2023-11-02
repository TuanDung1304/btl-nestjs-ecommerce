import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProductsModule } from 'src/products/products.module';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [ProductsModule],
})
export class CategoriesModule {}
