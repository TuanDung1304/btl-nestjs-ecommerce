import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  discountedPrice?: number;
}

export class DeleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
