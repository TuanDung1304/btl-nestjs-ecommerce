import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProductDto,
  DeleteProductDto,
} from 'src/products/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const category = await this.prisma.categories.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new ForbiddenException('Category not found');
    }
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        discountedPrice: dto?.discountedPrice,
        categoryId: category.id,
        description: dto?.description,
      },
    });

    return product;
  }

  async deleteProduct(dto: DeleteProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.id },
    });
    if (!product) {
      throw new ForbiddenException('Product not found');
    }

    return product;
  }

  async getProductsByCategories() {}
}
