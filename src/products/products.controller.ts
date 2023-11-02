import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateProductDto,
  DeleteProductDto,
} from 'src/products/dto/product.dto';
import { ProductsService } from 'src/products/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Post('/delete')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Body() dto: DeleteProductDto) {
    return this.productService.deleteProduct(dto);
  }
}
