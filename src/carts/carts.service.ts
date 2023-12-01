import { ForbiddenException, Injectable } from '@nestjs/common';
import { AddCartDto } from 'src/carts/dtos/addCart.dto';
import { AdjustQuantityDto } from 'src/carts/dtos/adjustQuantity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prismaService: PrismaService) {}

  async addCartItem(dto: AddCartDto, userId: number) {
    const model = await this.prismaService.productModel.findUnique({
      where: { id: dto.modelId },
    });
    if (!model) {
      throw new ForbiddenException('Model sản phẩm không tồn tại');
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
      message: 'Đã thêm vào giỏ hàng',
      cartItem: { id: cartItem.id, quantity: cartItem.quantity },
    };
  }

  async getCart(userId: number) {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: { userId, orderId: null },
      orderBy: {
        createdAt: 'desc',
      },
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
            acc.totalPrice +
            item.quantity *
              (item.productModel.product.discountedPrice ??
                item.productModel.product.price),
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

  async adjustQuantity(userId: number, dto: AdjustQuantityDto) {
    if (dto.quantity === 0) {
      await this.prismaService.cartItem.delete({
        where: {
          id: dto.cartItemId,
          userId,
        },
      });
      return {
        message: 'Đã xóa',
      };
    }
    const newCart = await this.prismaService.cartItem.update({
      where: { id: dto.cartItemId, userId },
      data: {
        quantity: dto.quantity,
      },
    });
    return {
      message: 'Thay đổi số lượng thành công',
      quantity: newCart.quantity,
    };
  }
}
