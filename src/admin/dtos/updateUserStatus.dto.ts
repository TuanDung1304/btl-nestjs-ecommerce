import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateUserStatus {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsIn(['Active', 'DeActive'])
  status: string;
}
