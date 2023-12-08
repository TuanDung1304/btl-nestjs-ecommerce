import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Giá trị voucher phải lớn hơn 0' })
  amount: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Giá trị đơn tối thiểu phải lớn hơn 0' })
  minOrderPrice: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Số lượng voucher phải lớn hơn 0' })
  maxUser: number;

  @IsDateString()
  @IsNotEmpty()
  startedAt: Date;

  @IsDateString()
  @IsNotEmpty()
  finishedAt: Date;
}
