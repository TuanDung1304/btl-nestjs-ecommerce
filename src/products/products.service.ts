import { ForbiddenException, Injectable } from '@nestjs/common';
import { compact, update } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProductDto,
  DeleteProductDto,
} from 'src/products/dto/product.dto';
import { UpdateProductDto } from 'src/products/dto/updateProduct.dto';
import { ListProductsData } from 'src/products/types';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new ForbiddenException('Category not found');
    }
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
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
    const product = await this.prisma.product.findUnique({
      where: { id: dto.id },
    });
    if (!product) {
      throw new ForbiddenException('Product not found');
    }

    await this.prisma.images.deleteMany({ where: { productId: dto.id } });
    await this.prisma.productModel.deleteMany({
      where: { productId: dto.id },
    });

    await this.prisma.product.delete({
      where: { id: dto.id },
    });

    return {
      message: 'Delete product successfully',
    };
  }

  async getListProducts(): Promise<ListProductsData[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'asc' },
      include: { productModels: { select: { quantity: true } } },
    });

    return products.map(
      ({ updatedAt, description, productModels, ...rest }) => ({
        ...rest,
        modelsCount: productModels.length,
        inStock: productModels.reduce((acc, model) => {
          return acc + model.quantity;
        }, 0),
      }),
    );
  }

  async getProductDetail(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        productModels: true,
        images: true,
      },
    });
    if (!product) {
      throw new ForbiddenException('Product not found');
    }
    await this.prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } },
    });

    const {
      id,
      description,
      discountedPrice,
      images,
      name,
      price,
      productModels,
      thumbnail,
      categoryId,
    } = product;

    return {
      id,
      name,
      description,
      price,
      discountedPrice,
      thumbnail,
      categoryId,
      images: images.map((image) => ({ id: image.id, url: image.url })),
      productModels: productModels.map(({ id, quantity, color, size }) => ({
        id,
        quantity,
        color,
        size,
      })),
    };
  }

  async updateProduct(dto: UpdateProductDto, productId: number) {
    const { productModels, images, categoryId, ...rest } = dto;
    console.log(dto);

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new ForbiddenException('Category not found');
    }
    const oldProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!oldProduct) {
      throw new ForbiddenException('Product not found');
    }
    const oldDiscountedPrice = oldProduct.discountedPrice;

    // delete images and models which are not in data
    const deletedImages = await this.prisma.images.deleteMany({
      where: {
        productId,
        id: { notIn: compact(images.map((item) => item.id)) },
      },
    });
    const deletedModels = await this.prisma.productModel.deleteMany({
      where: {
        productId,
        id: { notIn: compact(productModels.map((item) => item.id)) },
      },
    });

    // upsert many
    await this.prisma.$transaction(
      productModels.map((model) =>
        this.prisma.productModel.upsert({
          where: { productId, id: model.id ?? 0 },
          create: {
            productId,
            size: model.size,
            color: model.color,
            quantity: model.quantity,
          },
          update: { quantity: model.quantity },
        }),
      ),
    );

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...rest,
        categoryId,
        images: {
          createMany: {
            data: images
              .filter((image) => !image.id)
              .map((image) => ({ url: image.url })),
          },
        },
      },
      include: {
        images: true,
        productModels: true,
      },
    });

    if (
      updatedProduct.discountedPrice &&
      oldDiscountedPrice != updatedProduct.discountedPrice
    ) {
      const notification = await this.prisma.notification.create({
        data: {
          content: `Sản phẩm được giảm giá ${Math.floor(
            (1 - updatedProduct.discountedPrice / updatedProduct.price) * 100,
          )}%`,
          productId: updatedProduct.id,
        },
      });
      const usersContainProductCartItem = await this.prisma.user.findMany({
        where: {
          cartItems: {
            some: {
              productModel: {
                productId: updatedProduct.id,
              },
              orderId: null,
            },
          },
        },
      });
      await this.prisma.$transaction(
        usersContainProductCartItem.map((user) =>
          this.prisma.userNotification.create({
            data: {
              productId: updatedProduct.id,
              userId: user.id,
              notificationId: notification.id,
            },
          }),
        ),
      );
    }

    return {
      message: 'Update successfully',
      data: {
        updatedProduct,
        deletedImages,
        deletedModels,
      },
    };
  }

  async getProductsByCategories() {}
}
