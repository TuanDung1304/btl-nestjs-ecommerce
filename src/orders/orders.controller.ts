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
import { CancelOrderDto } from 'src/orders/dtos/cancelOrder.dts';
import { CreateOrderDto } from 'src/orders/dtos/createOrder.dto';
import { UpdateStatus } from 'src/orders/dtos/updateStatus.dto';
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

  @Post('/update-status')
  updateStatus(@Body() dto: UpdateStatus) {
    return this.ordersService.updateStatus(dto);
  }

  @Post('/cancel')
  cancelOrder(@Body() dto: CancelOrderDto) {
    return this.ordersService.cancelOrder(dto);
  }
}
