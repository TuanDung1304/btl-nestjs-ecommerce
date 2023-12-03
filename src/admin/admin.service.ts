import { ForbiddenException, Injectable } from '@nestjs/common';
import { groupBy, orderBy, reverse } from 'lodash';
import { CreateVoucherDto } from 'src/admin/dtos/createVoucher.dto';
import { UpdateUserStatus } from 'src/admin/dtos/updateUserStatus.dto';
import {
  ChartData,
  ChartName,
  DashboardData,
  TopDeal,
  Voucher,
} from 'src/admin/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private getPercentage(data: { createdAt: Date }[]) {
    const last2Days = this.getLast7daysChartData(data).splice(-2, 2);
    if (last2Days[0].value === 0) return last2Days[1].value ? 100 : 0;
    return Math.ceil((last2Days[1].value / last2Days[0].value - 1) * 100);
  }

  private getLast7daysChartData(
    data: { createdAt: Date }[],
  ): { name: string; value: number }[] {
    const days: { name: string; value: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const name = this.getDayOfWeek(
        new Date(Date.now() - i * 3600 * 24 * 1000),
      );
      days.push({ name, value: 0 });
    }
    const grouped = groupBy(data, (item) => this.getDayOfWeek(item.createdAt));

    return reverse(
      days.map((day) => ({
        ...day,
        value: grouped[day.name]?.length ?? 0,
      })),
    );
  }

  private getDayOfWeek(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return date.toLocaleDateString('vn-VI', options);
  }

  private async getChartData(type: ChartName): Promise<ChartData> {
    let total, data;
    const startToday = new Date().setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(startToday - 6 * 24 * 3600 * 1000);

    const option = {
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    };

    switch (type) {
      case ChartName.Products:
        total = await this.prisma.product.count();
        data = await this.prisma.product.findMany(option);
        break;
      case ChartName.Users:
        total = await this.prisma.user.count();
        data = await this.prisma.user.findMany(option);
        break;
      case ChartName.Orders:
        total = await this.prisma.order.count();
        data = await this.prisma.order.findMany(option);
        break;
      case ChartName.Profit:
        total = (await this.prisma.order.findMany()).reduce(
          (acc, item) => acc + item.totalPrice,
          0,
        );
        data = [];
        break;
    }

    return {
      total: total,
      dataKey: type,
      chartData: this.getLast7daysChartData(data),
      percentage: this.getPercentage(data),
    };
  }

  async topDeals(): Promise<TopDeal[]> {
    const users = await this.prisma.user.findMany({
      where: { role: { not: 'Admin' } },
      select: {
        id: true,
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
        orders: { select: { totalPrice: true } },
      },
    });

    const response = users.map(({ orders, ...rest }) => ({
      ...rest,
      total: orders.reduce((acc, item) => acc + item.totalPrice, 0),
    }));

    return orderBy(response, ['total'], ['desc']).slice(0, 5);
  }

  async getDashboard(): Promise<DashboardData> {
    return {
      products: await this.getChartData(ChartName.Products),
      orders: await this.getChartData(ChartName.Orders),
      users: await this.getChartData(ChartName.Users),
      profit: await this.getChartData(ChartName.Profit),
      topDeals: await this.topDeals(),
    };
  }

  async updateUserStatus(dto: UpdateUserStatus) {
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        isActive: dto.status === 'Active' ? true : false,
      },
    });

    return {
      message: 'Cập nhật thành công',
    };
  }

  async createVoucher(dto: CreateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code: dto.code },
    });
    if (voucher) {
      throw new ForbiddenException('Voucher code đã tồn tại');
    }
    await this.prisma.voucher.create({ data: dto });

    return { message: 'Tạo voucher thành công' };
  }

  async getVouchers(): Promise<Voucher[]> {
    const vouchers = await this.prisma.voucher.findMany({
      include: {
        orders: { select: { id: true } },
      },
    });

    return vouchers.map(({ updatedAt, orders, ...rest }) => {
      const status =
        Date.now() < rest.finishedAt.getTime() &&
        Date.now() > rest.startedAt.getTime()
          ? 'Hiệu lực'
          : 'Hết hạn';
      return {
        ...rest,
        status,
        used: orders.length,
      };
    });
  }
}
