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
    const cartItem = await this.prismaService.cartItem.create({
      data: {
        quantity: dto.quantity,
        productModelId: dto.modelId,
        userId: userId,
      },
    });

    return {
      message: 'Add product to cart successfully',
      cartItem: { id: cartItem.id, quantity: cartItem.quantity },
    };
  }
}
