import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListUsersData } from 'src/users/types';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUserInfo(userId: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });
    const { createdAt, updatedAt, password, ...resData } = user;

    return resData;
  }

  async getListUsers(): Promise<ListUsersData[]> {
    const users = await this.prismaService.users.findMany();

    return users.map(({ hashRt, updatedAt, password, ...rest }) => rest);
  }
}
