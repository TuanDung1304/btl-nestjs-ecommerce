import { IsNotEmpty, IsNumber } from 'class-validator';

export class CancelOrderDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
