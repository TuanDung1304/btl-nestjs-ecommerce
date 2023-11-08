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
    const product = await this.prisma.products.create({
      data: {
        name: dto.name,
        price: dto.price,
        discountedPrice: dto?.discountedPrice,
        description: dto?.description,
        categoryId: category.id,
        thumbnail: dto.thumbnail,
        images: {
          createMany: {
            data: dto.images.map((img) => ({ url: img.url })),
            skipDuplicates: true,
          },
        },
        productModels: {
          createMany: {
            data: [
              { color: 'Red', size: 'L', quantity: 99 },
              { color: 'Green', size: 'L', quantity: 0 },
            ],
          },
        },
      },
    });

    return {
      message: 'Tao san pham moi thanh cong',
      id: product.id,
    };
  }

  async deleteProduct(dto: DeleteProductDto) {
    const product = await this.prisma.products.findUnique({
      where: { id: dto.id },
    });
    if (!product) {
      throw new ForbiddenException('Product not found');
    }

    await this.prisma.images.deleteMany({ where: { productId: dto.id } });
    await this.prisma.productModels.deleteMany({
      where: { productId: dto.id },
    });

    await this.prisma.products.delete({
      where: { id: dto.id },
    });

    return {
      message: 'Delete product successfully',
    };
  }

  async getProductDetail(productId: number) {
    const product = await this.prisma.products.findUnique({
      where: { id: Number(productId) },
      include: {
        productModels: true,
        images: true,
      },
    });
    if (!product) {
      throw new ForbiddenException('Product not found');
    }

    const {
      id,
      description,
      discountedPrice,
      images,
      name,
      price,
      productModels,
      thumbnail,
    } = product;

    return {
      id,
      name,
      description,
      price,
      discountedPrice,
      thumbnail,
      images: images.map((image) => ({ url: image.url })),
      productModels: productModels.map(({ id, quantity, color, size }) => ({
        id,
        quantity,
        color,
        size,
      })),
    };
  }

  async getProductsByCategories() {}
}
