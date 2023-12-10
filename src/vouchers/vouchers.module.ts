import { Module } from '@nestjs/common';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { CartsService } from 'src/carts/carts.service';

@Module({
  controllers: [VouchersController],
  providers: [VouchersService, CartsService],
})
export class VouchersModule {}
