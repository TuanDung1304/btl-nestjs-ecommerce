import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
