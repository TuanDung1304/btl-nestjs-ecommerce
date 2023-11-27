import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AdminGuard } from 'src/common/guards/roles.guard';
import {
  CreateProductDto,
  DeleteProductDto,
} from 'src/products/dto/product.dto';
import { UpdateProductDto } from 'src/products/dto/updateProduct.dto';
import { ProductsService } from 'src/products/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @UseGuards(AdminGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @UseGuards(AdminGuard)
  @Post('/delete')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Body() dto: DeleteProductDto) {
    return this.productService.deleteProduct(dto);
  }

  @UseGuards(AdminGuard)
  @Get('/listProducts')
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.productService.getListProducts();
  }

  @UseGuards(AdminGuard)
  @Post('/edit/:productId')
  @HttpCode(HttpStatus.OK)
  updateProduct(@Body() dto: UpdateProductDto, @Param() { productId }) {
    return this.productService.updateProduct(dto, Number(productId));
  }

  @Public()
  @Get('/trending')
  @HttpCode(HttpStatus.OK)
  getTrending() {
    return this.productService.getTrendingProducts();
  }

  @Public()
  @Get('/:productId')
  @HttpCode(HttpStatus.OK)
  getProductDetail(@Param() { productId }) {
    return this.productService.getProductDetail(Number(productId));
  }
}
