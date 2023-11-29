import { OrderStatus } from '@prisma/client';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStatus {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(OrderStatus))
  status: OrderStatus;
}
