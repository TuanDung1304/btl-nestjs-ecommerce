import { Injectable } from '@nestjs/common';
import { groupBy, sortBy } from 'lodash';
import { ChartData, ChartName, DashboardData, TopDeal } from 'src/admin/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  getPercentage(data: { createdAt: Date }[]) {
    const last2Days = this.getLast7daysChartData(data).splice(0, 2);
    if (last2Days[1].value === 0) return last2Days[0].value ? 100 : 0;
    return Math.ceil((last2Days[0].value / last2Days[1].value - 1) * 100);
  }

  getLast7daysChartData(
    data: { createdAt: Date }[],
  ): { name: string; value: number }[] {
    const days: { name: string; value: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const name = this.getDayOfWeek(
        new Date(today.getTime() - i * 3600 * 24 * 1000),
      );
      days.push({ name, value: 0 });
    }
    const grouped = groupBy(data, (item) => this.getDayOfWeek(item.createdAt));

    return days.map((day) => ({
      ...day,
      value: grouped[day.name]?.length ?? 0,
    }));
  }

  getDayOfWeek(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return date.toLocaleDateString('vn-VI', options);
  }

  async getChartData(type: ChartName): Promise<ChartData> {
    let total, data;
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 3600 * 1000);

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

    const response = users
      .map(({ orders, ...rest }) => ({
        ...rest,
        total: orders.reduce((acc, item) => acc + item.totalPrice, 0),
      }))
      .slice(0, 5);

    return sortBy(response, 'total');
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
}
