import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustQuantityDto {
  @IsNumber()
  @IsNotEmpty()
  cartItemId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
