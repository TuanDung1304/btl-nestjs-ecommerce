import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';
import { AdminGuard } from 'src/common/guards/roles.guard';
import { CreateOrderDto } from 'src/orders/dtos/createOrder.dto';
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

  @Get('/my-orders')
  @HttpCode(HttpStatus.CREATED)
  getMyOrders(@GetCurrentUser('sub') userId: number) {
    return this.ordersService.getMyOrders(userId);
  }

  @UseGuards(AdminGuard)
  @Get('/admin-orders')
  getOrders() {
    return this.ordersService.adminGetOrders();
  }
}
