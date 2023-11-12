import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FilterDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min?: number;

  @IsNumber()
  @IsOptional()
  @Max(5000000)
  max?: number;

  @IsString()
  @IsOptional()
  sortBy?: 'default' | 'newest' | 'asc' | 'desc';

  @IsNumber()
  page: number;

  @IsNumber()
  perPage: number;
}
