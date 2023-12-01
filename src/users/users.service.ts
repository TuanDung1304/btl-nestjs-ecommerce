import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    if (!user.isActive) {
      throw new UnauthorizedException();
    }
    const { createdAt, updatedAt, password, hashRt, ...resData } = user;
    const cartItems = await this.prismaService.cartItem.findMany({
      where: { userId, orderId: null },
    });
    const lastSeen = await this.prismaService.userSeen.findFirst({
      where: { userId },
      orderBy: {
        lastSeen: 'desc',
      },
    });
    const unSeenNotifications = await this.prismaService.userNotification.count(
      {
        where: {
          userId,
          notification: {
            createdAt: { gte: lastSeen?.lastSeen ?? new Date(0) },
          },
        },
      },
    );

    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      ...resData,
      cartQuantity: count,
      notifyBadge: unSeenNotifications,
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
      throw new ForbiddenException('Người dùng không tồn tại');
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
      throw new ForbiddenException('Người dùng không tồn tại');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    return { message: 'Cập nhật thành công', updatedUser };
  }

  async getNotifications(userId: number) {
    const lastSeen = await this.prismaService.userSeen.findFirst({
      where: { userId },
      orderBy: {
        lastSeen: 'desc',
      },
    });
    const userNotification = await this.prismaService.userNotification.findMany(
      {
        where: {
          userId,
        },
        select: {
          notification: {
            select: {
              product: {
                select: { thumbnail: true, name: true, id: true },
              },
              content: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          notification: {
            createdAt: 'desc',
          },
        },
      },
    );

    return {
      lastSeen: lastSeen.lastSeen,
      notifications: userNotification.map((item) => item.notification),
    };
  }
}
