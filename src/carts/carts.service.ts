import { ForbiddenException, Injectable } from '@nestjs/common';
import { AddCartDto } from 'src/carts/dtos/addCart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prismaService: PrismaService) {}

  async addCartItem(dto: AddCartDto, userId: number) {
    console.log(dto);
    const model = await this.prismaService.productModel.findUnique({
      where: { id: dto.modelId },
    });
    if (!model) {
      throw new ForbiddenException('Product model is not exist');
    }
    const cartItem = await this.prismaService.cartItem.upsert({
      where: {
        userId_productModelId: { userId, productModelId: dto.modelId },
      },
      create: {
        quantity: dto.quantity,
        productModelId: dto.modelId,
        userId: userId,
      },
      update: {
        quantity: { increment: dto.quantity },
      },
    });

    return {
      message: 'Add product to cart successfully',
      cartItem: { id: cartItem.id, quantity: cartItem.quantity },
    };
  }

  async getCart(userId: number) {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: { userId, orderId: null },
      select: {
        id: true,
        quantity: true,
        productModel: {
          select: {
            color: true,
            id: true,
            quantity: true,
            size: true,
            product: {
              select: {
                id: true,
                thumbnail: true,
                name: true,
                price: true,
                discountedPrice: true,
              },
            },
          },
        },
      },
    });
    const { totalItem, totalPrice } = cartItems.reduce(
      (acc, item) => {
        return {
          totalPrice:
            acc.totalPrice + item.quantity * item.productModel.product.price,
          totalItem: acc.totalItem + item.quantity,
        };
      },
      {
        totalPrice: 0,
        totalItem: 0,
      },
    );

    return {
      cartItems,
      totalPrice,
      totalItem,
    };
  }
}
