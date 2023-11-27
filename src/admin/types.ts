export interface ChartData {
  total: number;
  chartData: { day: string; value: number }[];
  percentage: number;
  dataKey: ChartName;
}

export enum ChartName {
  Products = 'products',
  Users = 'users',
  Orders = 'orders',
  Profit = 'profit',
}

export type DashboardData = Record<ChartName, ChartData>;
