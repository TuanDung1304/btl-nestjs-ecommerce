import { IsNumber, IsOptional } from 'class-validator';
import { CreateProductDto } from 'src/products/dto/product.dto';

export class UpdateProductDto extends CreateProductDto {
  @IsOptional()
  @IsNumber()
  discountedPrice?: number;
}
