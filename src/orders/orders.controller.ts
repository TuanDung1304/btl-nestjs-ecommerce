import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';
import { CreateOrderDto } from 'src/orders/createOrder.dto';
import { OrdersService } from 'src/orders/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createOrder(
    @Body() dto: CreateOrderDto,
    @GetCurrentUser('sub') userId: number,
  ) {
    return this.ordersService.createOrder(dto, userId);
  }
}
