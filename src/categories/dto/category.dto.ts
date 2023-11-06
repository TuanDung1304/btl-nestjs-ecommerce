import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$/, {
    message:
      'chỉ chứa số, chữ và gạch ngang, bắt đầu bằng chữ, không kết thúc bằng gạch ngang, không có 2 dấu gạch ngang liền kề',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Áo', 'Quần', 'Phụ Kiện'], {
    message: 'Category type phải thuộc các giá trị Áo, Quần, Phụ Kiện',
  })
  type: 'Quần' | 'Áo' | 'Phụ Kiện';
}
