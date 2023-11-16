import { ProductModel } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddCartDto {
  @IsNumber()
  @IsNotEmpty()
  modelId: ProductModel['id'];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
