import { User } from '@prisma/client';

export interface ChartData {
  total: number;
  chartData: { name: string; value: number }[];
  percentage: number;
  dataKey: ChartName;
}

export enum ChartName {
  Products = 'products',
  Users = 'users',
  Orders = 'orders',
  Profit = 'profit',
}

export type TopDeal = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'avatar'
> & {
  total: number;
};

export type DashboardData = Record<ChartName, ChartData> & {
  topDeals: TopDeal[];
};

export interface Voucher {
  id: number;
  name: string;
  code: string;
  amount: number;
  used: number;
  maxUser: number;
  createdAt: Date;
  startedAt: Date;
  finishedAt: Date;
  status: string;
}
