import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreateProductDto,
  DeleteProductDto,
} from 'src/products/dto/product.dto';
import { UpdateProductDto } from 'src/products/dto/updateProduct.dto';
import { ProductsService } from 'src/products/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Post('/delete')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Body() dto: DeleteProductDto) {
    return this.productService.deleteProduct(dto);
  }

  @Get('/listProducts')
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.productService.getListProducts();
  }

  @Get('/:productId')
  @HttpCode(HttpStatus.OK)
  getProductDetail(@Param() { productId }) {
    return this.productService.getProductDetail(productId);
  }

  @Post('/edit/:productId')
  @HttpCode(HttpStatus.OK)
  updateProduct(@Body() dto: UpdateProductDto, @Param() { productId }) {
    return this.productService.updateProduct(dto, Number(productId));
  }
}
