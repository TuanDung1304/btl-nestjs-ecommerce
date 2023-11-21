import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListUsersData } from 'src/users/types';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUserInfo(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    const { createdAt, updatedAt, password, hashRt, ...resData } = user;
    const cartItems = await this.prismaService.cartItem.findMany({
      where: { userId, orderId: null },
    });
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return { ...resData, cartQuantity: count };
  }

  async getListUsers(): Promise<ListUsersData[]> {
    const users = await this.prismaService.user.findMany();

    return users.map(({ hashRt, updatedAt, password, ...rest }) => rest);
  }
}
