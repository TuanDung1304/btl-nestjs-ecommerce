import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from 'src/users/dtos/updateInfo.dto';
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
    const lastSeen = await this.prismaService.userSeen.findFirst({
      where: { userId },
    });
    const userNotification = await this.prismaService.userNotification.findMany(
      {
        where: {
          userId,
          notification: {
            createdAt: { gte: lastSeen?.lastSeen ?? new Date(0) },
          },
        },
      },
    );
    const notifications = await this.prismaService.notification.findMany({
      where: {
        id: {
          in: userNotification.map(({ notificationId }) => notificationId),
        },
      },
      select: {
        product: {
          select: { thumbnail: true, name: true, id: true },
        },
        content: true,
        createdAt: true,
      },
    });

    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      ...resData,
      cartQuantity: count,
      notifications,
    };
  }

  async getListUsers(): Promise<ListUsersData[]> {
    const users = await this.prismaService.user.findMany();

    return users.map(({ hashRt, updatedAt, password, ...rest }) => rest);
  }

  async setLastSeen(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException();
    }

    const lastSeen = await this.prismaService.userSeen.create({
      data: {
        userId,
      },
    });

    return { lastSeen: lastSeen.lastSeen };
  }

  async updateUserInfo(dto: UpdateProfileDto, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    return { message: 'Update successfully', updatedUser };
  }
}
