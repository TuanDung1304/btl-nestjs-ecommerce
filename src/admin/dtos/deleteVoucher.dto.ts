import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteVoucherDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
